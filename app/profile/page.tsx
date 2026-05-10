import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import { Activity, CalendarClock, Flame, Gamepad2, Medal, Target, Trophy, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: recentGames } = await supabase
    .from("game_sessions")
    .select(`
      *,
      categories (name, slug)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(8)

  const games = recentGames ?? []
  const xp = profile?.xp ?? 0
  const level = profile?.level ?? Math.floor(xp / 1000) + 1
  const nextLevelProgress = xp % 1000
  const averageAccuracy = games.length
    ? Math.round(
        games.reduce((sum, game) => sum + (game.total_questions ? game.correct_answers / game.total_questions : 0), 0) /
          games.length *
          100,
      )
    : 0

  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-5">
                <div className="flex size-20 items-center justify-center rounded-xl bg-primary/15 text-3xl font-bold text-primary">
                  {(profile?.display_name || profile?.username || user.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <Badge className="mb-2 bg-accent/20 text-accent-foreground hover:bg-accent/25">Level {level}</Badge>
                  <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
                    {profile?.display_name || profile?.username || "Player"}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="mt-7">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Next level</span>
                  <span className="font-mono">{nextLevelProgress}/1000 XP</span>
                </div>
                <Progress value={(nextLevelProgress / 1000) * 100} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={<Trophy />} label="Total Score" value={(profile?.total_score || 0).toLocaleString()} />
              <Metric icon={<Gamepad2 />} label="Games" value={`${profile?.games_played || 0}`} />
              <Metric icon={<Target />} label="Accuracy" value={`${averageAccuracy}%`} />
              <Metric icon={<Flame />} label="Best Streak" value={`${profile?.best_streak ?? 0}`} />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.42fr]">
            <div className="rounded-xl border border-white/15 bg-card/75 p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <h2 className="text-2xl font-semibold">Recent Runs</h2>
                </div>
                <Activity className="size-6 text-primary" />
              </div>

              {games.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-10 text-center">
                  <Gamepad2 className="mx-auto mb-4 size-10 text-muted-foreground" />
                  <p className="font-medium">No games played yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Start a category to build your run history.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {games.map((game) => {
                    const category = game.categories as { name: string; slug: string } | null
                    const accuracy = game.total_questions ? Math.round((game.correct_answers / game.total_questions) * 100) : 0
                    return (
                      <div key={game.id} className="rounded-xl border border-white/10 bg-background/40 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{category?.name || "Unknown category"}</p>
                            <p className="text-sm text-muted-foreground">
                              {game.correct_answers}/{game.total_questions} correct
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-lg font-bold text-primary">{game.score}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(game.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Progress value={accuracy} className="mt-3 h-2" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <div className="glass-panel rounded-xl p-6">
                <Medal className="mb-4 size-7 text-accent" />
                <h2 className="text-xl font-semibold">Achievements</h2>
                <div className="mt-5 space-y-3">
                  <Achievement unlocked={(profile?.games_played ?? 0) >= 1} label="First Run" />
                  <Achievement unlocked={(profile?.best_streak ?? 0) >= 3} label="Combo Builder" />
                  <Achievement unlocked={(profile?.total_score ?? 0) >= 5000} label="Point Hunter" />
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6">
                <CalendarClock className="mb-4 size-7 text-primary" />
                <h2 className="text-xl font-semibold">Daily Challenge</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  One ranked challenge per day is ready in the data model. Wire it to a scheduled quiz rotation when
                  content volume grows.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="mb-4 text-primary [&_svg]:size-5">{icon}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold">{value}</p>
    </div>
  )
}

function Achievement({ unlocked, label }: { unlocked: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-background/40 px-3 py-2">
      <span className="text-sm font-medium">{label}</span>
      {unlocked ? <Zap className="size-4 text-accent" /> : <span className="text-xs text-muted-foreground">Locked</span>}
    </div>
  )
}
