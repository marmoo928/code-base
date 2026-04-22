import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: pathwayId } = await params;
        const session = await getSession();

        // Get all tasks and include whether they belong to this pathway
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                name: true,
                index: true,
                pathwayId: true
            },
            orderBy: { index: 'asc' }
        });

        return NextResponse.json(tasks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: pathwayId } = await params;
        const session = await getSession();
        const { taskIds } = await request.json(); // Array of task IDs that should be in this pathway

        if (!Array.isArray(taskIds)) {
            return NextResponse.json({ error: "taskIds must be an array" }, { status: 400 });
        }

        // 1. Remove all tasks currently in this pathway
        await prisma.task.updateMany({
            where: { pathwayId: pathwayId },
            data: { pathwayId: null }
        });

        // 2. Set the new tasks for this pathway
        if (taskIds.length > 0) {
            await prisma.task.updateMany({
                where: { id: { in: taskIds } },
                data: { pathwayId: pathwayId }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
