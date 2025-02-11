"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  CalendarDays,
  ListTodo,
  Timer,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/routines", icon: Timer, label: "Routines" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
]

export function FooterNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-container-high border-t border-outline/20">
      <nav className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  "hover:bg-primary/10",
                  isActive ? "text-primary" : "text-foreground/60"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}