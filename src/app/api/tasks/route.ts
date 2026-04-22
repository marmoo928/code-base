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
        const id = searchParams.get("id");

        if (id) {
            const task = await prisma.task.findUnique({
                where: { id },
                include: {
                    testCases: true,
                    tags: {
                        include: { tag: true }
                    }
                }
            });
            if (!task) {
                return NextResponse.json({ error: "Task not found" }, { status: 404 });
            }
            return NextResponse.json(task);
        }

        const tasks = await prisma.task.findMany({
            orderBy: { index: 'asc' },
            select: {
                id: true,
                name: true,
                xp: true,
                index: true,
                difficulty: true,
                pathwayId: true
            }
        });

        return NextResponse.json(tasks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    // Authorization check
    if (session?.user?.role !== 'TEACHER') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
        name, 
        difficulty, 
        xp, 
        tags, 
        description, 
        inputDescription, 
        outputDescription,
        exampleInput,
        exampleOutput,
        constraints,
        testCases,
        pathwayId
    } = await request.json();

    // Basic validation
    if (!name || !description || !testCases || testCases.length === 0) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine the next sequential index
    const lastTask = await prisma.task.findFirst({
        orderBy: { index: 'desc' },
        select: { index: true }
    });
    const nextIndex = (lastTask?.index || 0) + 1;

    // Create task and test cases in a transaction
    const newTask = await prisma.$transaction(async (tx) => {
        // 1. Create the task
        const createdTask = await tx.task.create({
            data: {
                index: nextIndex,
                name,
                difficulty: parseInt(difficulty),
                xp: parseInt(xp),
                description,
                inputDescription,
                outputDescription,
                exampleInput,
                exampleOutput,
                constraints,
                pathwayId: pathwayId || null,
                testCases: {
                    create: testCases.map((tc: any) => ({
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        isHidden: tc.isHidden || false
                    }))
                }
            }
        });

        // 2. Handle tags (M:N mapping)
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                const tag = await tx.taskTag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName },
                });

                await tx.taskTagMap.create({
                    data: {
                        taskId: createdTask.id,
                        tagId: tag.id,
                    }
                });
            }
        }

        return createdTask;
    });

    return NextResponse.json({ success: true, taskId: newTask.id, index: newTask.index });

  } catch (error: any) {
    console.error("Task Creation API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (session?.user?.role !== 'TEACHER') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const { 
        name, 
        difficulty, 
        xp, 
        tags, 
        description, 
        inputDescription, 
        outputDescription,
        exampleInput,
        exampleOutput,
        constraints,
        testCases,
        pathwayId
    } = await request.json();

    await prisma.$transaction(async (tx) => {
        // 1. Update the task
        await tx.task.update({
            where: { id },
            data: {
                name,
                difficulty: parseInt(difficulty),
                xp: parseInt(xp),
                description,
                inputDescription,
                outputDescription,
                exampleInput,
                exampleOutput,
                constraints,
                pathwayId: pathwayId || null,
            }
        });

        // 2. Update Test Cases (Smarter update to preserve results)
        if (testCases) {
            // For now, let's just keep it simple: if the number of test cases is the same, 
            // we update them instead of deleting to preserve the relation in SubmissionResult.
            // This is a heuristic but much better than wiping everything.
            const existingTestCases = await tx.testCase.findMany({
                where: { taskId: id },
                orderBy: { id: 'asc' }
            });

            if (existingTestCases.length === testCases.length) {
                // Update existing
                for (let i = 0; i < testCases.length; i++) {
                    await tx.testCase.update({
                        where: { id: existingTestCases[i].id },
                        data: {
                            input: testCases[i].input,
                            expectedOutput: testCases[i].expectedOutput,
                            isHidden: testCases[i].isHidden || false
                        }
                    });
                }
            } else {
                // If count changed, we unfortunately have to recreate for now (until we have IDs in frontend)
                // but at least we don't wipe them if nothing changed.
                await tx.testCase.deleteMany({ where: { taskId: id } });
                await tx.testCase.createMany({
                    data: testCases.map((tc: any) => ({
                        taskId: id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        isHidden: tc.isHidden || false
                    }))
                });
            }
        }

        // 3. Update Tags
        if (tags) {
            // Delete old mappings
            await tx.taskTagMap.deleteMany({ where: { taskId: id } });
            
            for (const tagName of tags) {
                const tag = await tx.taskTag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName },
                });

                await tx.taskTagMap.create({
                    data: {
                        taskId: id,
                        tagId: tag.id,
                    }
                });
            }
        }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Task Update API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();
        if (session?.user?.role !== 'TEACHER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
        }

        // Use transaction to ensure cleanup of relations if not handled by Cascade
        await prisma.$transaction(async (tx) => {
            // TestCases, Submissions, Progress should ideally be Cascade Delete in schema
            // but we can be explicit here if needed. 
            // Based on schema.prisma, AssignedTask is Cascade. Others are not explicitly Cascade.
            
            await tx.testCase.deleteMany({ where: { taskId: id } });
            await tx.taskTagMap.deleteMany({ where: { taskId: id } });
            await tx.assignedTask.deleteMany({ where: { taskId: id } });
            await tx.userTaskProgress.deleteMany({ where: { taskId: id } });
            
            // Note: Submissions might have SubmissionResults. 
            // Better to handle this via schema or a thorough transaction.
            const submissions = await tx.submission.findMany({ where: { taskId: id }, select: { id: true } });
            const subIds = submissions.map(s => s.id);
            await tx.submissionResult.deleteMany({ where: { submissionId: { in: subIds } } });
            await tx.submission.deleteMany({ where: { taskId: id } });

            await tx.task.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Task Deletion API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
