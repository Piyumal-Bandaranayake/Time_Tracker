"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const navLinks = [
    { href: "/Dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/tasks", label: "Task Manager", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="glass px-5 py-3 rounded-4xl border border-white/10 flex items-center justify-between shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">TimeTracker</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                pathname === link.href 
                  ? "bg-white/10 text-white border border-white/10 shadow-inner" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              <span className="hidden md:block">{link.label}</span>
            </Link>
          ))}
          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-red-100 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/10 hover:border-red-500/20 group"
          >
            <svg className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>

  );
}

