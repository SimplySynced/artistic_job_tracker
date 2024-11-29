import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await auth(); // Get the current session
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    try {
        // Update the user information in the database
        const updatedUser = await prisma.user.update({
            where: { email: session?.user?.email },
            data: { name, email },
        });

        // Return the updated user information
        return NextResponse.json({
            message: "Account updated successfully.",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                emailVerified: updatedUser.emailVerified || null,
            },
        });
    } catch (error) {
        console.error("Error updating account:", error);
        return NextResponse.json({ error: "Failed to update account." }, { status: 500 });
    }
}
