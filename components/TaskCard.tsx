"use client";

import TimerButton from "./TimerButton";

interface TaskCardProps {
  task: any;
  refresh: () => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onToggle: (task: any) => void;
}

export default function TaskCard({
  task,
  refresh,
  onEdit,
  onDelete,
  onToggle,
}: TaskCardProps) {
  return (
    <div 
      className={`glass p-6 rounded-4xl border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden ${
        task.completed ? 'opacity-50 border-white/5 bg-white/2' : 'border-white/10 hover:border-white/20 hover:bg-white/5 hover:translate-y-[-2px] hover:shadow-2xl'
      }`}
    >
      {/* Active Indicator */}
      {!task.completed && (
        <div className="absolute top-0 left-0 w-[2px] h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}

      <div className="flex items-start gap-5 flex-1 relative z-10">
        <button 
          onClick={() => onToggle(task)}
          className={`mt-1.5 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
            task.completed 
              ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
              : 'border-white/20 hover:border-primary group-hover:scale-110'
          }`}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h3 className={`text-xl font-bold transition-all duration-300 ${task.completed ? 'text-gray-600 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            {task.totalTime > 0 && (
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${
                task.completed ? 'bg-white/2 border-white/5 text-gray-700' : 'bg-primary/10 border-primary/20 text-primary animate-in fade-in slide-in-from-left-2 duration-500'
              }`}>
                <span className="w-1 h-1 rounded-full bg-current"></span>
                {Math.floor(task.totalTime / 60)}m {task.totalTime % 60}s
              </span>
            )}
          </div>
          {task.description && (
            <p className={`text-sm mt-1.5 leading-relaxed ${task.completed ? 'text-gray-700' : 'text-gray-400 font-medium'}`}>
              {task.description}
            </p>
          )}
        </div>

      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        {!task.completed && (
          <>
            <div className="scale-110">
              <TimerButton taskId={task.id} refresh={refresh} />
            </div>
            <div className="w-px h-10 bg-white/5 mx-1 hidden md:block"></div>
          </>
        )}
        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">

          <button 
            onClick={() => onEdit(task)}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-primary/20 text-gray-500 hover:text-primary transition-all border border-white/5 hover:border-primary/20"
            title="Edit Task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20"
            title="Delete Task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  );
}

