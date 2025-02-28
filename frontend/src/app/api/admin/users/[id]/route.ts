// frontend/src/app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { db } from "@/server/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  console.log("Admin DELETE session:", session); // Debug log
  
  // Check if the session exists and if the user is an admin
  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = params.id;
  try {
    await db.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Failed to delete user", error }, { status: 500 });
  }
}
