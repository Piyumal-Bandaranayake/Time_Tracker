"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-height-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next Gen Time Tracking
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Master Your Productivity <br className="hidden md:block" /> with Precision.
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
          The ultimate task tracker designed for professionals who value every second. 
          Manage tasks, track progress, and optimize your workflow in one sleek interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-24 duration-1000">
          {[
            { title: "Real-time Analytics", desc: "Visualize your time allocation with beautiful charts." },
            { title: "Smart Scheduling", desc: "Intelligent task prioritization based on your habits." },
            { title: "Global Sync", desc: "Access your dashboard from any device, anywhere." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 text-left hover:border-primary/50 transition-colors group">
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
