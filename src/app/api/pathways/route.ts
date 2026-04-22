import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const pathways = await prisma.pathway.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        });
        return NextResponse.json(pathways);
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

        const { name, description } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const lastPathway = await prisma.pathway.findFirst({
            orderBy: { order: 'desc' }
        });
        const nextOrder = (lastPathway?.order || 0) + 1;

        const newPathway = await prisma.pathway.create({
            data: {
                name,
                description,
                order: nextOrder
            }
        });

        return NextResponse.json({ success: true, pathway: newPathway });
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
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            // Detach tasks first
            await tx.task.updateMany({
                where: { pathwayId: id },
                data: { pathwayId: null }
            });

            await tx.pathway.delete({
                where: { id }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
