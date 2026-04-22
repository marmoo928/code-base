import { prisma } from './prisma';
import { getSession } from './auth';

export async function fetchTasks() {
    const session = await getSession();
    const userId = session?.user?.id;

    try {
        // 1. Get user's classes to check for assignments
        const userData = userId ? await prisma.user.findUnique({
            where: { id: userId },
            select: { classes: { select: { id: true } } }
        }) : null;
        const userClassIds = userData?.classes.map(c => c.id) || [];

        const tasks = await prisma.task.findMany({
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                progress: {
                    where: { userId: userId || "" },
                    include: { bestSubmission: { select: { xpEarned: true } } }
                },
                assignedTo: {
                    where: { classId: { in: userClassIds } },
                    select: { dueDate: true }
                }
            },
            orderBy: { index: 'asc' }
        });

        // Transform database structure to match the UI expectation
        return tasks.map((task) => {
            const userProgress = task.progress[0];
            let status = 'Not started';
            if (userProgress?.status === 'SOLVED') status = 'Solved';
            else if (userProgress?.status === 'IN_PROGRESS') status = 'Submitted';

            const assigned = task.assignedTo[0];
            
            // Fallback: If solved but earnedXP is 0 (due to past bugs), show full XP
            let earnedXP = userProgress?.bestSubmission?.xpEarned || 0;
            if (status === 'Solved' && earnedXP === 0) earnedXP = task.xp;

            return {
                index: task.index,
                id: task.id,
                name: task.name,
                xp: task.xp,
                earnedXP,
                difficulty: task.difficulty,
                tags: task.tags.map((t) => t.tag.name),
                status,
                isRequired: task.assignedTo.length > 0,
                deadline: assigned?.dueDate || null,
            };
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch tasks.');
    }
}

export async function fetchUserProfile() {
    const session = await getSession();
    if (!session?.user?.id) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                xpTotal: true,
                role: true,
                progress: {
                    include: { bestSubmission: { select: { xpEarned: true } } }
                }
            }
        });

        if (!user) return null;

        // Self-healing: Recalculate xpTotal if it's incorrect
        const actualXp = user.progress.reduce((sum, p) => sum + (p.bestSubmission?.xpEarned || 0), 0);
        if (actualXp !== user.xpTotal) {
            await prisma.user.update({
                where: { id: user.id },
                data: { xpTotal: actualXp }
            });
            user.xpTotal = actualXp;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            xpTotal: user.xpTotal,
            role: user.role,
        };
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}

export async function fetchPathways() {
    const session = await getSession();
    const userId = session?.user?.id;

    try {
        // Get user's classes
        const userData = userId ? await prisma.user.findUnique({
            where: { id: userId },
            select: { classes: { select: { id: true } } }
        }) : null;
        const userClassIds = userData?.classes.map(c => c.id) || [];

        const pathways = await prisma.pathway.findMany({
            include: {
                tasks: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                        progress: {
                            where: { userId: userId || "" },
                            include: { bestSubmission: { select: { xpEarned: true } } }
                        },
                        assignedTo: {
                            where: { classId: { in: userClassIds } },
                            select: { dueDate: true }
                        }
                    },
                    orderBy: { index: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        });

        return pathways.map((pathway) => {
            const completedTasks = pathway.tasks.filter(t => t.progress[0]?.status === 'SOLVED').length;
            const totalTasks = pathway.tasks.length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return {
                id: pathway.id,
                name: pathway.name,
                description: pathway.description,
                progress,
                tasks: pathway.tasks.map((task) => {
                    const userProgress = task.progress[0];
                    let status = 'Not started';
                    if (userProgress?.status === 'SOLVED') status = 'Solved';
                    else if (userProgress?.status === 'IN_PROGRESS') status = 'Submitted';

                    const assigned = task.assignedTo[0];
                    
                    let earnedXP = userProgress?.bestSubmission?.xpEarned || 0;
                    if (status === 'Solved' && earnedXP === 0) earnedXP = task.xp;

                    return {
                        id: task.id,
                        index: task.index,
                        name: task.name,
                        xp: task.xp,
                        earnedXP,
                        difficulty: task.difficulty,
                        tags: task.tags.map((t) => t.tag.name),
                        status,
                        isRequired: task.assignedTo.length > 0,
                        deadline: assigned?.dueDate || null,
                    };
                }),
            };
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch pathways.');
    }
}

export async function fetchTaskByIndex(index: number) {
    const session = await getSession();
    const userId = session?.user?.id;

    try {
        const task = await prisma.task.findUnique({
            where: { index },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                testCases: true,
                progress: {
                    where: { userId: userId || "" }
                }
            },
        });

        if (!task) return null;

        // Find next task (using index for ordering)
        const nextTask = await prisma.task.findFirst({
            where: {
                index: {
                    gt: task.index
                }
            },
            orderBy: {
                index: 'asc'
            },
            select: { index: true }
        });

        // Find last submission to restore code and results
        const lastSubmission = userId ? await prisma.submission.findFirst({
            where: { taskId: task.id, userId },
            orderBy: { submittedAt: 'desc' },
            include: {
                results: {
                    include: {
                        testCase: true
                    }
                }
            }
        }) : null;

        const userProgress = task.progress[0];
        let status = 'Not started';
        if (userProgress?.status === 'SOLVED') status = 'Solved';
        else if (userProgress?.status === 'IN_PROGRESS') status = 'Submitted';

        // Transform to match existing Task type used in components
        return {
            id: task.id,
            index: task.index,
            name: task.name,
            tags: task.tags.map((t) => t.tag.name),
            difficulty: task.difficulty,
            status,
            xp: task.xp,
            lastSubmittedCode: lastSubmission?.code || null,
            lastSubmittedResults: lastSubmission?.results.map((r, idx) => ({
                testCaseId: r.testCaseId,
                testName: `Test ${idx + 1}`,
                passed: r.passed,
                input: r.testCase.isHidden ? 'Hidden' : r.testCase.input,
                expected: r.testCase.isHidden ? 'Hidden' : r.testCase.expectedOutput,
                actual: r.testCase.isHidden ? (r.passed ? 'Hidden' : 'Incorrect output') : r.actualOutput,
                isOpen: !r.passed && !r.testCase.isHidden
            })) || [],
            nextTaskId: nextTask?.index ? String(nextTask.index) : null,
            details: {
                description: task.description,
                inputDescription: task.inputDescription,
                outputDescription: task.outputDescription,
                exampleInput: task.exampleInput,
                exampleOutput: task.exampleOutput,
                constraints: task.constraints,
            },
            testCases: task.testCases.map((tc) => ({
                id: tc.id,
                input: tc.isHidden ? 'Hidden' : tc.input,
                expected: tc.isHidden ? 'Hidden' : tc.expectedOutput,
                isHidden: tc.isHidden,
            })),
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch task detail.');
    }
}

export async function fetchUserClasses() {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) return [];

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
                classes: {
                    select: {
                        id: true,
                        name: true,
                        _count: {
                            select: { assignedTasks: true, students: true }
                        }
                    }
                },
                managedClasses: {
                    select: {
                        id: true,
                        name: true,
                        joinCode: true,
                        _count: {
                            select: { assignedTasks: true, students: true }
                        }
                    }
                }
            }
        });

        if (!user) return [];

        const classesToReturn = user.role === 'TEACHER' ? user.managedClasses : user.classes;

        return classesToReturn.map(c => ({
            id: c.id,
            name: c.name,
            joinCode: 'joinCode' in c ? c.joinCode : undefined,
            taskCount: c._count.assignedTasks,
            studentCount: c._count.students,
            isManaged: user.role === 'TEACHER'
        }));
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user classes.');
    }
}

export async function fetchClassWithTasks(classId: string) {
    const session = await getSession();
    const userId = session?.user?.id;

    try {
        const classData = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                assignedTasks: {
                    include: {
                        task: {
                            include: {
                                tags: { include: { tag: true } },
                                progress: { where: { userId: userId || "" } }
                            }
                        }
                    },
                    orderBy: { task: { index: 'asc' } }
                }
            }
        });

        if (!classData) return null;

        return {
            id: classData.id,
            name: classData.name,
            joinCode: classData.joinCode,
            tasks: classData.assignedTasks.map(at => {
                const task = at.task;
                const userProgress = task.progress[0];
                let status = 'Not started';
                if (userProgress?.status === 'SOLVED') status = 'Solved';
                else if (userProgress?.status === 'IN_PROGRESS') status = 'Submitted';

                return {
                    id: task.id,
                    index: task.index,
                    name: task.name,
                    xp: task.xp,
                    difficulty: task.difficulty,
                    tags: task.tags.map(t => t.tag.name),
                    status,
                    isRequired: true,
                    deadline: at.dueDate,
                };
            })
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch class tasks.');
    }
}
