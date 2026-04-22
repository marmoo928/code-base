import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const taskId = searchParams.get('taskId');

    if (!studentId || !taskId) {
      return NextResponse.json({ error: 'studentId and taskId are required' }, { status: 400 });
    }

    // If teacher, verify they manage a class this student is in
    if (session.user.role === 'TEACHER') {
      const commonClass = await prisma.class.findFirst({
        where: {
          teacherId: session.user.id,
          students: { some: { id: studentId } }
        }
      });
      if (!commonClass) {
        return NextResponse.json({ error: 'Unauthorized: student is not in your class' }, { status: 403 });
      }
    } else if (session.user.id !== studentId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch the best submission
    const progress = await prisma.userTaskProgress.findUnique({
      where: { userId_taskId: { userId: studentId, taskId } },
      include: {
        bestSubmission: {
          include: {
            results: {
              include: { testCase: { select: { isHidden: true, input: true, expectedOutput: true } } }
            }
          }
        },
        user: { select: { name: true, email: true } },
        task: { select: { name: true, xp: true } }
      }
    });

    if (!progress?.bestSubmission) {
      return NextResponse.json({ error: 'No submission found' }, { status: 404 });
    }

    return NextResponse.json({
      studentName: progress.user.name,
      taskName: progress.task.name,
      taskXP: progress.task.xp,
      status: progress.status,
      code: progress.bestSubmission.code,
      language: progress.bestSubmission.language,
      submittedAt: progress.bestSubmission.submittedAt,
      xpEarned: progress.bestSubmission.xpEarned,
      results: progress.bestSubmission.results.map(r => ({
        passed: r.passed,
        isHidden: r.testCase.isHidden,
        input: r.testCase.input,
        expectedOutput: r.testCase.expectedOutput,
        actualOutput: r.actualOutput
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, code, language, results } = await request.json();

    if (!taskId || !code || !language || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Calculate XP proportionally
    const passedCount = results.filter((r: any) => r.passed).length;
    const totalCount = results.length;
    const allPassed = passedCount === totalCount;
    const submissionStatus = allPassed ? 'ACCEPTED' : 'WRONG_ANSWER';
    
    // Fetch the task to get total possible XP
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { xp: true }
    });

    if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const xpEarned = totalCount > 0 ? Math.round(task.xp * (passedCount / totalCount)) : 0;

    // 2. Create Submission and update progress in a transaction
    const submission = await prisma.$transaction(async (tx) => {
      // Create the main submission record
      const newSubmission = await tx.submission.create({
        data: {
          userId: userId,
          taskId,
          code,
          language,
          status: submissionStatus,
          xpEarned,
          results: {
            create: results.map((r: any) => ({
              testCaseId: r.testCaseId,
              passed: r.passed,
              actualOutput: String(r.actual || r.actualOutput || r.output || ''),
              executionTimeMs: 0,
            }))
          }
        }
      });

      // 3. Update User Task Progress and handle XP Delta
      const existingProgress = await tx.userTaskProgress.findUnique({
        where: { userId_taskId: { userId, taskId } },
        include: { bestSubmission: { select: { xpEarned: true } } }
      });

      const oldBestXP = existingProgress?.bestSubmission?.xpEarned || 0;
      const isImprovement = xpEarned >= oldBestXP;
      
      let newStatus = allPassed ? 'SOLVED' : (xpEarned > 0 ? 'IN_PROGRESS' : (existingProgress?.status || 'IN_PROGRESS'));
      if (existingProgress?.status === 'SOLVED') newStatus = 'SOLVED';

      await tx.userTaskProgress.upsert({
        where: { userId_taskId: { userId, taskId } },
        update: {
          status: newStatus as any,
          bestSubmissionId: isImprovement ? newSubmission.id : existingProgress?.bestSubmissionId,
        },
        create: {
          userId: userId,
          taskId,
          status: newStatus as any,
          bestSubmissionId: newSubmission.id,
        }
      });

      // 4. Recalculate User XP Total from all their best submissions (Robust approach)
      const allProgress = await tx.userTaskProgress.findMany({
        where: { userId },
        include: { bestSubmission: { select: { xpEarned: true } } }
      });
      
      const newXpTotal = allProgress.reduce((sum, p) => sum + (p.bestSubmission?.xpEarned || 0), 0);
      
      await tx.user.update({
        where: { id: userId },
        data: { xpTotal: newXpTotal }
      });

      return newSubmission;
    });

    return NextResponse.json({
        success: true,
        submissionId: submission.id,
        status: submissionStatus,
        xpEarned
    });

  } catch (error: any) {
    console.error('Submission API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save submission' },
      { status: 500 }
    );
  }
}
