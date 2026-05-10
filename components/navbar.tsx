"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { BarChart3, Gamepad2, Home, LogOut, Menu, Trophy, UserRound } from "lucide-react"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Play", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Dashboard", icon: BarChart3 },
]

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  const navLinkClass = (href: string) =>
    cn(
      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      pathname === href
        ? "bg-primary/15 text-primary"
        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
    )

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-bold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            Q
          </span>
          <span>QuizVerse</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.slice(1).map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative hidden h-9 w-9 rounded-full md:inline-flex">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserRound className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-8 grid gap-2">
                {links.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={navLinkClass(item.href)}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  )
                })}
                {user ? (
                  <Button variant="outline" onClick={handleSignOut} className="mt-4 justify-start">
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                ) : (
                  <Button asChild className="mt-4">
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
