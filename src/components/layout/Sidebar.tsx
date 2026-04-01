"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PieChart, ArrowRightLeft, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { name: "Settings", href: "#", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-full w-[260px] flex-col rounded-[2rem] border border-black/5 dark:border-white/5 bg-background/50 backdrop-blur-2xl px-4 py-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.2)] ring-1 ring-white/10 dark:ring-white/5 z-20">
      <div className="mb-8 flex items-center px-4">
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <PieChart className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Zorvyn</span>
      </div>
      <nav className="flex-1 space-y-1.5 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto px-4 py-4 text-xs font-medium text-muted-foreground/60">
        &copy; 2026 Zorvyn Inc.
      </div>
    </div>
  )
}
