import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";


// UPDATE TASK
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    // Verify task belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask || existingTask.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existingTask.title,
        description: body.description !== undefined ? body.description : existingTask.description,
        completed: body.completed !== undefined ? body.completed : existingTask.completed,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
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
  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;

    // Verify task belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask || existingTask.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

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

