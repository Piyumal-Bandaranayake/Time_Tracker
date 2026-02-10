import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// UPDATE TASK
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(error); // 👈 IMPORTANT DEBUG
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}


// DELETE TASK
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
