import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'STUDENT') {
            return NextResponse.json({ error: "Unauthorized. Must be a student to join a class." }, { status: 401 });
        }

        const { joinCode } = await request.json();
        if (!joinCode) return NextResponse.json({ error: "Join code is required" }, { status: 400 });

        // Find class by code
        const targetClass = await prisma.class.findUnique({
            where: { joinCode: joinCode.trim().toUpperCase() }
        });

        if (!targetClass) {
            return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
        }

        // Assign student to class
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { 
                classes: { 
                    connect: { id: targetClass.id } 
                } 
            },
            select: {
                id: true,
                name: true,
                classes: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: `Successfully joined class: ${targetClass.name}`,
            class: targetClass
        });

    } catch (error: any) {
        console.error("Join Class API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
