import Link from "next/link"
import { ArrowRight, BadgeCheck, BarChart3, Flame, Gamepad2, Sparkles, Trophy, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroScene } from "@/components/hero-scene"
import { CategoryGrid } from "@/components/category-grid"
import { Navbar } from "@/components/navbar"

const highlights = [
  { label: "Timed arenas", value: "30s", icon: Gamepad2 },
  { label: "XP progression", value: "Levels", icon: Sparkles },
  { label: "Streak bonuses", value: "Combo", icon: Flame },
  { label: "Leaderboard", value: "Ranked", icon: Trophy },
]

const features = [
  {
    title: "Game-first quiz flow",
    description: "Speed bonuses, difficulty scaling, instant answer feedback, explanations, and result saves.",
    icon: Gamepad2,
  },
  {
    title: "Player progression",
    description: "Profiles track score, XP, level, recent runs, streaks, and accuracy trends.",
    icon: BadgeCheck,
  },
  {
    title: "Operations-ready",
    description: "Supabase-backed categories, questions, attempts, leaderboards, and admin-friendly schema.",
    icon: BarChart3,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      <section className="relative min-h-[92vh] px-4 pt-24">
        <div className="grid-pattern absolute inset-0 opacity-45" />
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div className="relative z-10 mx-auto grid min-h-[calc(92vh-6rem)] max-w-7xl items-center gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge className="mb-5 bg-primary/15 text-primary hover:bg-primary/20">
              <Sparkles className="mr-1 size-3.5" />
              Interactive trivia arena
            </Badge>
            <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-balance md:text-7xl">
              QuizVerse
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              A polished quiz platform with timed challenges, XP progression, streaks, leaderboards, and animated
              category worlds built for repeat play.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href="/categories">
                  Start Playing
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 bg-background/40 px-6 text-base">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <div className="rounded-lg border border-white/10 bg-background/45 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Challenge</p>
                  <h2 className="text-2xl font-semibold">Brain Sprint</h2>
                </div>
                <UsersRound className="size-8 text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <Icon className="mb-4 size-5 text-primary" />
                      <p className="font-mono text-xl font-bold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 rounded-lg bg-primary/10 p-4 text-sm leading-6 text-muted-foreground">
                Win streaks compound your score, but every second counts. Choose fast, learn instantly, climb steadily.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge variant="outline" className="mb-3">Categories</Badge>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-5xl">
                Choose your arena
              </h2>
            </div>
            <p className="max-w-xl text-muted-foreground">
              Each category has a distinct visual identity, question mix, and difficulty curve.
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="glass-panel rounded-xl p-6">
                <Icon className="mb-5 size-7 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-7 text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
