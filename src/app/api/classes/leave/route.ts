import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'STUDENT') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { classId } = await request.json();
        if (!classId) return NextResponse.json({ error: "Class ID is required" }, { status: 400 });

        // Disconnect user from the class
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                classes: {
                    disconnect: { id: classId }
                }
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: "Successfully left the class" 
        });

    } catch (error: any) {
        console.error("Leave Class API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
