"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TaskCard from "@/components/TaskCard";
import Navbar from "@/components/Navbar";


export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  async function load() {
    try {
      const data = await api("/api/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsCreating(true);
    try {
      await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      load();
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsCreating(false);
    }
  }

  async function toggleComplete(task: any) {
    try {
      const updated = await api(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  }

  async function deleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }


  async function updateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    try {
      const updated = await api(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        body: JSON.stringify({ 
          title: editingTask.title,
          description: editingTask.description 
        }),
      });
      setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen p-6 md:p-10 pt-44 relative overflow-hidden bg-[#0f172a]">
      <Navbar />
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
              
            </h1>
           
          </div>
        </header>

        {/* Task Creation Form */}
        <section className="mb-16">
          <form onSubmit={create} className="glass p-8 rounded-4xl border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-transparent opacity-50"></div>
            
            <div className="flex items-center gap-3 mb-2 px-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-focus-within:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Create New Task</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Task Title</label>
                <div className="relative">
                  <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Design Landing Page"
                    className="input-field pl-11"
                  />
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                <div className="relative">
                  <input 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="e.g. Create mockup in Figma"
                    className="input-field pl-11"
                  />
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={isCreating || !title.trim()}
                className="btn-primary md:w-auto px-12 h-14 text-base font-bold shadow-[0_10px_30px_rgba(59,130,246,0.3)] active:scale-95 transition-all"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </section>


        {/* Tasks List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              Current Tasks
            </h2>
            <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass p-12 rounded-3xl text-center text-gray-500 border-2 border-dashed border-white/5">
                <p className="text-lg">No tasks yet. Fill the form above to get started!</p>
              </div>
            ) : (
              tasks.sort((a, b) => Number(a.completed) - Number(b.completed)).map(t => (
                <TaskCard 
                  key={t.id} 
                  task={t} 
                  refresh={load} 
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  onToggle={toggleComplete}
                />
              ))
            )}
          </div>
        </section>
      </div>


      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0f172a]/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg rounded-5xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Edit Task</h2>
              <button 
                onClick={() => setEditingTask(null)}
                className="p-3 rounded-2xl hover:bg-white/5 transition-all text-gray-500 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={updateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Task Title</label>
                <input 
                  value={editingTask.title} 
                  onChange={e => setEditingTask({...editingTask, title: e.target.value})} 
                  placeholder="Task Title"
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={editingTask.description || ""} 
                  onChange={e => setEditingTask({...editingTask, description: e.target.value})} 
                  placeholder="Task Description"
                  rows={4}
                  className="input-field resize-none py-4"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!editingTask.title.trim()}
                  className="flex-2 btn-primary h-auto! py-4 font-bold shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

