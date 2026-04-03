"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ArrowLeftRight, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex h-full w-[72px] lg:w-[220px] flex-col shrink-0 border-r border-border bg-transparent px-3 py-6 transition-all duration-300 relative">
      {/* Vertical indigo hairline */}
      <div className="absolute right-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      {/* Brand — matches Zorvyn logo style: icon + wordmark */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#06B6D4] shadow-lg shadow-primary/30">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 1V15M2 4.5L14 11.5M14 4.5L2 11.5" stroke="white" strokeWidth="0.75" strokeOpacity="0.5"/>
          </svg>
        </div>
        <div className="hidden lg:flex flex-col">
          <span className="text-sm font-bold text-foreground tracking-tight leading-none">Zorvyn</span>
          <span className="text-[9px] text-muted-foreground tracking-widest uppercase leading-tight mt-0.5">Fintech</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {/* Active left indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-gradient-to-b from-primary to-cyan-400" />
              )}
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="hidden lg:block font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Live indicator */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-2 mt-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">Live</span>
      </div>
    </aside>
  )
}
