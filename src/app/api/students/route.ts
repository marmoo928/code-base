import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (session?.user?.role !== 'TEACHER') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const taskId = searchParams.get('taskId');

    // Fetch assigned task IDs for this class if classId is provided
    let assignedTaskIds: string[] = [];
    if (classId) {
        const assignments = await prisma.assignedTask.findMany({
            where: { classId },
            select: { taskId: true }
        });
        assignedTaskIds = assignments.map(a => a.taskId);
    }

    const students = await prisma.user.findMany({
        where: { 
            role: 'STUDENT',
            ...(classId ? { classes: { some: { id: classId } } } : {})
        },
        select: {
            id: true,
            email: true,
            name: true,
            xpTotal: true,
            createdAt: true,
            classes: {
                select: { id: true, name: true }
            },
            progress: {
                where: taskId ? { taskId: taskId } : { status: { in: ['SOLVED', 'IN_PROGRESS'] } },
                select: {
                    taskId: true,
                    status: true,
                    bestSubmission: {
                        select: { submittedAt: true }
                    }
                }
            }
        },
        orderBy: { xpTotal: 'desc' }
    });

    let totalTasks = await prisma.task.count();
    if (classId) {
        totalTasks = await prisma.assignedTask.count({ where: { classId } });
    }

    // Fetch due date if filtering by task
    let dueDate: Date | null = null;
    if (taskId && classId) {
        const assigned = await prisma.assignedTask.findUnique({
            where: { classId_taskId: { classId, taskId } },
            select: { dueDate: true }
        });
        dueDate = assigned?.dueDate ?? null;
    }

    const formattedStudents = students.map(s => {
        const taskProgress = s.progress[0];
        const taskStatus = taskId ? (taskProgress?.status || 'NOT_SOLVED') : undefined;
        const submittedAt = (taskId && taskProgress?.bestSubmission?.submittedAt) 
            ? taskProgress.bestSubmission.submittedAt 
            : undefined;

        // onTime: true = submitted before deadline, false = late, null = no deadline
        const onTime = taskId
            ? submittedAt && dueDate
                ? new Date(submittedAt) <= dueDate
                : submittedAt && !dueDate
                ? null
                : undefined
            : undefined;

        return {
            id: s.id,
            name: s.name,
            email: s.email,
            xp: s.xpTotal,
            classLabels: s.classes.map(c => c.name),
            classIds: s.classes.map(c => c.id),
            solvedCount: taskId ? undefined : (
                classId 
                ? s.progress.filter(p => assignedTaskIds.includes(p.taskId)).length
                : s.progress.length
            ),
            taskStatus,
            submittedAt,
            onTime,
            totalTasks,
            joinedAt: s.createdAt
        };
    });

    return NextResponse.json(formattedStudents);

  } catch (error: any) {
    console.error("Fetch Students API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
