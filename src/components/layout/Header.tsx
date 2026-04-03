"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { RoleSwitcher } from "@/components/RoleSwitcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, LayoutDashboard, ArrowLeftRight, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Header() {
  const pathname = usePathname()
  const isTransactions = pathname === "/transactions"
  const isSettings = pathname === "/settings"
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const now = new Date()
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  const pageName = isTransactions ? "Transactions" : isSettings ? "Settings" : "Overview"

  return (
    <>
      <header className="flex h-18 shrink-0 items-center justify-between px-6 md:px-12 py-5 relative z-30">
        {/* Left: Breadcrumb + Date (Hidden on mobile when menu open to save space, or just keep it) */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span>Zorvyn</span>
            <span className="text-border">·</span>
            <span className="text-primary">{pageName}</span>
          </div>
          <p className="text-xs text-muted-foreground/50 mt-0.5 hidden sm:block">{dateStr} · {timeStr}</p>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <RoleSwitcher />
            <div className="h-5 w-px bg-border" />
          </div>
          <ThemeToggle />
          <div className="hidden sm:block h-5 w-px bg-border" />
          <Avatar className="h-9 w-9 ring-2 ring-border ring-offset-2 ring-offset-background cursor-pointer transition-all duration-200 hover:ring-primary/60">
            <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">SN</AvatarFallback>
          </Avatar>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden ml-2 p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Glass Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-background/80 backdrop-blur-xl md:hidden animate-in fade-in duration-300 pt-24 px-6 flex flex-col">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground bg-card border border-border"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          <div className="mt-auto mb-8 space-y-4">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <RoleSwitcher />
            </div>
            <div className="flex items-center justify-between px-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <span>{dateStr}</span>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
