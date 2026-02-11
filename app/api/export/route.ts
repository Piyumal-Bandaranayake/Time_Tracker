import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const userId = requireAuth(req);

    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        timeEntries: {
          select: { duration: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const headers = ["Task ID", "Title", "Description", "Status", "Total Time (Minutes)", "Created At"]; // Task ID included for reference, but maybe not vital for user?
    
    const rows = tasks.map(task => {
      // Calculate total duration in seconds, convert to minutes
      const totalSeconds = task.timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      const totalMinutes = (totalSeconds / 60).toFixed(2);
      
      return [
        task.id,
        // Escape quotes by doubling them
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || "").replace(/"/g, '""')}"`,
        task.completed ? "Completed" : "In Progress",
        totalMinutes,
        task.createdAt.toISOString()
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="task-tracker-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
