import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (session?.user?.role !== 'TEACHER') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const teacherId = session.user.id;
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('id');

    if (classId) {
        // Fetch specific class with assigned tasks and completion stats
        const classData = await prisma.class.findUnique({
            where: { id: classId, teacherId },
            include: {
                assignedTasks: {
                    include: {
                        task: {
                            select: { id: true, name: true, xp: true }
                        }
                    }
                },
                _count: {
                    select: { students: true }
                }
            }
        });

        if (!classData) return NextResponse.json({ error: "Class not found" }, { status: 404 });

        // For each assigned task, calculate completion stats
        const studentIds = (await prisma.user.findMany({
            where: { classes: { some: { id: classId } } },
            select: { id: true }
        })).map(s => s.id);

        const tasksWithStats = await Promise.all(classData.assignedTasks.map(async (at) => {
            const completedCount = await prisma.userTaskProgress.count({
                where: {
                    taskId: at.taskId,
                    userId: { in: studentIds },
                    status: { in: ['SOLVED', 'IN_PROGRESS'] }
                }
            });

            return {
                ...at,
                completedCount,
                studentCount: classData._count.students
            };
        }));

        return NextResponse.json({
            ...classData,
            assignedTasks: tasksWithStats
        });
    }

    const classes = await prisma.class.findMany({
        where: { teacherId: teacherId },
        select: {
            id: true,
            name: true,
            joinCode: true,
            _count: {
                select: { students: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return NextResponse.json(classes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (session?.user?.role !== 'TEACHER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        // Generate unique join code
        let joinCode = "";
        let isUnique = false;
        while (!isUnique) {
            joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existing = await prisma.class.findUnique({ where: { joinCode } });
            if (!existing) isUnique = true;
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                joinCode,
                teacherId: session.user.id,
            }
        });

        return NextResponse.json({
            ...newClass,
            _count: { students: 0 }
        });
    } catch (error: any) {
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
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        // Verify ownership
        const targetClass = await prisma.class.findUnique({ where: { id } });
        if (!targetClass || targetClass.teacherId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
        }

        await prisma.class.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
