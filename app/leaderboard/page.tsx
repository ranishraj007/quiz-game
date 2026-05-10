import { Medal, Sparkles, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"

type LeaderboardPlayer = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  total_score: number
  games_played: number
  level?: number | null
  best_streak?: number | null
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const primary = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, total_score, games_played, level, best_streak")
    .gt("total_score", 0)
    .order("total_score", { ascending: false })
    .limit(50)

  let leaderboard: LeaderboardPlayer[] | null = primary.data as LeaderboardPlayer[] | null
  let error = primary.error

  if (error?.code === "42703" || error?.code === "PGRST204") {
    const fallback = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, total_score, games_played")
      .gt("total_score", 0)
      .order("total_score", { ascending: false })
      .limit(50)

    leaderboard = fallback.data as LeaderboardPlayer[] | null
    error = fallback.error
  }

  const leaders = leaderboard ?? []
  const topThree = leaders.slice(0, 3)

  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/20">
              <Trophy className="mr-1 size-3.5" />
              Ranked players
            </Badge>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-6xl">
              Leaderboard
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Top players by all-time score. Streaks, XP, and category mastery all feed the climb.
            </p>
          </div>

          {error ? (
            <div className="glass-panel rounded-xl p-12 text-center">
              <Trophy className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="font-medium">Leaderboard could not load</p>
              <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="glass-panel rounded-xl p-12 text-center">
              <Trophy className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="font-medium">No scores yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Be the first player to post a run.</p>
            </div>
          ) : (
            <>
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                {topThree.map((player, index) => (
                  <PodiumCard key={player.id} player={player} rank={index + 1} />
                ))}
              </div>
              <div className="overflow-hidden rounded-xl border border-white/15 bg-card/75 backdrop-blur-xl">
                {leaders.map((player, index) => (
                  <div
                    key={player.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 p-4 last:border-b-0"
                  >
                    <div className="flex size-10 items-center justify-center rounded-md bg-background/70 font-mono font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                        {(player.display_name || player.username || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{player.display_name || player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Level {player.level ?? 1} · {player.games_played} games · best streak {player.best_streak ?? 0}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-bold text-primary">{player.total_score.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function PodiumCard({ player, rank }: { player: LeaderboardPlayer; rank: number }) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <div className="mb-5 flex items-center justify-between">
        {rank === 1 ? <Trophy className="size-7 text-accent" /> : <Medal className="size-7 text-primary" />}
        <Badge variant="outline">#{rank}</Badge>
      </div>
      <p className="text-lg font-semibold">{player.display_name || player.username}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="font-mono text-3xl font-bold">{player.total_score.toLocaleString()}</span>
        <Sparkles className="mb-1 size-4 text-primary" />
      </div>
    </div>
  )
}
