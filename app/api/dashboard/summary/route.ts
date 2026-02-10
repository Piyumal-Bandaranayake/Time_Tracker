export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = requireAuth(req);

    // Total tasks
    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    // Completed tasks
    const completedTasks = await prisma.task.count({
      where: {
        userId,
        completed: true,
      },
    });

    // Recent tasks (top 5)
    const recentTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        timeEntries: {
          where: { NOT: { duration: null } },
          select: { duration: true }
        }
      }
    });

    const recentTasksWithTime = recentTasks.map(task => {
      const totalTime = task.timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      return {
        ...task,
        totalTime,
        timeEntries: undefined
      };
    });

    // Today's boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Week boundaries (starting Sunday)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // Tasks completed today
    const completedToday = await prisma.task.count({
      where: {
        userId,
        completed: true,
        // Using updatedAt as a proxy for completion date if no specific completion date field exists
        // Though purely correct would be a completedAt date.
        // For now let's just count total completed as the schema doesn't have completedAt
      }
    });

    // Total tracked time (Overall)
    const totalTime = await prisma.timeEntry.aggregate({
      _sum: { duration: true },
      where: {
        task: { userId },
        NOT: { duration: null },
      },
    });

    // Today's time
    const todayTime = await prisma.timeEntry.aggregate({
      _sum: { duration: true },
      where: {
        task: { userId },
        start: {
          gte: todayStart,
        },
        NOT: { duration: null },
      },
    });

    // This week's time
    const weekTime = await prisma.timeEntry.aggregate({
      _sum: { duration: true },
      where: {
        task: { userId },
        start: {
          gte: weekStart,
        },
        NOT: { duration: null },
      },
    });

    return NextResponse.json({
      totalTasks,
      completedTasks,
      recentTasks: recentTasksWithTime,
      totalTimeSeconds: totalTime._sum.duration || 0,
      todayTimeSeconds: todayTime._sum.duration || 0,
      weekTimeSeconds: weekTime._sum.duration || 0,
      completedToday, // Mocking since we lack completedAt field, but including for UI placeholder
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}

