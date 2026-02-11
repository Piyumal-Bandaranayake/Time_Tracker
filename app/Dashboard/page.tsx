"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";
import TaskCard from "@/components/TaskCard";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  async function fetchStats() {
    try {
      const [summary, weekly] = await Promise.all([
        api("/api/dashboard/summary"),
        api("/api/dashboard/weekly")
      ]);
      setData(summary);
      setWeeklyData(weekly);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  async function toggleComplete(task: any) {
    try {
      await api(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed }),
      });
      fetchStats();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  }

  async function deleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      fetchStats();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  async function exportCsv() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/export", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to export CSV:", err);
      alert("Failed to export data. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-gray-400 bg-[#0f172a]">
        <div>
          <h2 className="text-xl mb-4">No dashboard data found</h2>
          <button onClick={() => window.location.reload()} className="btn-primary px-6">Retry</button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const stats = [
    { label: "Total Tasks", value: data.totalTasks, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-blue-400" },
    { label: "Completed", value: data.completedTasks, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-400" },
    { label: "Today", value: formatTime(data.todayTimeSeconds), icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-orange-400" },
    { label: "This Week", value: formatTime(data.weekTimeSeconds), icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-purple-400" }
  ];

  const productivityScore = data.totalTasks > 0 
    ? Math.round((data.completedTasks / data.totalTasks) * 100) 
    : 0;

  const maxWeeklySeconds = Math.max(...weeklyData.map(d => d.seconds), 1);

  return (
    <div className="min-h-screen p-6 md:p-10 pt-16 relative overflow-hidden bg-[#0f172a]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={exportCsv}
              className="glass px-6 py-3 h-12 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all border border-white/5 active:scale-95 flex items-center gap-2 group text-gray-300 hover:text-white"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <Link href="/tasks" className="glass px-6 py-3 h-12 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all border border-white/5 active:scale-95 flex items-center gap-2 group text-gray-300 hover:text-white">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Task Manager
            </Link>
            <Link href="/tasks" className="btn-primary px-6 h-12 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="px-6 py-3 h-12 rounded-2xl text-sm font-semibold bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <StatCard 
              key={i}
              title={stat.label}
              value={stat.value}
              color={stat.color}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              }
            />
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 glass p-8 rounded-4xl min-h-[400px] flex flex-col border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Weekly Activity
            </h2>
            
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 px-2 pb-4">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="relative w-full flex flex-col items-center">
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-primary/20 to-primary rounded-xl transition-all duration-1000 ease-out relative group-hover/bar:brightness-125 group-hover/bar:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      style={{ height: `${Math.max((d.seconds / maxWeeklySeconds) * 200, 4)}px` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                        {Math.floor(d.seconds / 60)}m
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 group-hover/bar:text-white transition-colors">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-4xl min-h-[400px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors"></div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
              Productivity Score
            </h2>
            <div className="flex flex-col items-center justify-center p-10 bg-primary/5 rounded-3xl border border-primary/10 group-hover:border-primary/20 transition-all">
              <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * productivityScore) / 100}
                    className="text-primary transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{productivityScore}</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Score</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-400 leading-relaxed font-medium">
                {productivityScore >= 80 ? 'Excellent work!' : productivityScore >= 50 ? 'Keep going!' : 'Stay focused!'} Your task completion is at <span className="text-primary font-bold">{productivityScore}%</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Tasks List */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-2 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-2 h-8 bg-secondary rounded-full"></span>
              Recent Tasks
            </h2>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm pl-10 transition-all font-medium text-white placeholder-gray-500"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {data.recentTasks && data.recentTasks.length > 0 ? (
              data.recentTasks
                .filter((t: any) => 
                  t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((t: any) => (
                  <TaskCard 
                    key={t.id} 
                    task={t} 
                    refresh={fetchStats} 
                    onEdit={() => {}} 
                    onDelete={deleteTask}
                    onToggle={toggleComplete}
                  />
                ))
            ) : (
              <div className="glass p-12 rounded-3xl text-center text-gray-500 border border-white/5">
                <p>No tasks found. Start by creating one!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}



