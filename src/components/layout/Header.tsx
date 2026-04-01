"use client"

import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { RoleSwitcher } from "@/components/RoleSwitcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const pathname = usePathname()
  
  const title = pathname === "/transactions" ? "Transactions" : "Dashboard Overview"

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 bg-transparent px-8 z-10 sticky top-0 transition-all duration-300 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <RoleSwitcher />
        <div className="h-5 w-px bg-border/60 mx-1" />
        <ThemeToggle />
        <Avatar className="h-8 w-8 border shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
