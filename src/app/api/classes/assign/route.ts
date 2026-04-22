import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Assign a task to a class
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { classId, taskId, dueDate } = await request.json();
        
        if (!classId || !taskId) {
            return NextResponse.json({ error: "Class ID and Task ID are required" }, { status: 400 });
        }

        // Upsert assignment
        const assignment = await prisma.assignedTask.upsert({
            where: {
                classId_taskId: {
                    classId,
                    taskId
                }
            },
            update: {
                dueDate: dueDate ? new Date(dueDate) : null
            },
            create: {
                classId,
                taskId,
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });

        return NextResponse.json({ success: true, assignment });

    } catch (error: any) {
        console.error("Assign Task API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Unassign a task from a class
export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'TEACHER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const classId = searchParams.get('classId');
        const taskId = searchParams.get('taskId');

        if (!classId || !taskId) {
            return NextResponse.json({ error: "Class ID and Task ID are required" }, { status: 400 });
        }

        await prisma.assignedTask.delete({
            where: {
                classId_taskId: {
                    classId,
                    taskId
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Unassign Task API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
