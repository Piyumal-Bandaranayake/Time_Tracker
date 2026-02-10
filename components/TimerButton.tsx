"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TimerButton({
  taskId,
  refresh,
}: {
  taskId: string;
  refresh: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api(`/api/time/active?taskId=${taskId}`).then((res) => {
      setRunning(!!res);
      setIsLoading(false);
    });
  }, [taskId]);

  async function start() {
    setIsLoading(true);
    try {
      await api("/api/time/start", {
        method: "POST",
        body: JSON.stringify({ taskId }),
      });
      setRunning(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function stop() {
    setIsLoading(true);
    try {
      await api("/api/time/stop", {
        method: "PATCH",
        body: JSON.stringify({ taskId }),
      });
      setRunning(false);
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
    );
  }

  return running ? (
    <button 
      onClick={stop} 
      className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 shadow-lg hover:shadow-red-500/20 border border-red-500/20 hover:border-red-500"
      title="Stop Timer"
    >
      <div className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-20 pointer-events-none" />
      <svg className="w-6 h-6 relative z-10 group-active:scale-90 transition-transform" fill="currentColor" viewBox="0 0 24 24">
        <rect x="7" y="7" width="10" height="10" rx="2" />
      </svg>
    </button>
  ) : (
    <button 
      onClick={start} 
      className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all duration-500 border border-white/5 hover:border-primary shadow-sm hover:shadow-primary/20"
      title="Start Timer"
    >
      <svg className="w-6 h-6 group-active:scale-90 transition-transform" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 6.5v11l8.5-5.5z" />
      </svg>
    </button>
  );
}


