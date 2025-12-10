import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Trophy, Medal } from "lucide-react"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: leaderboard } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, total_score, games_played")
    .gt("total_score", 0)
    .order("total_score", { ascending: false })
    .limit(50)

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 border-yellow-500/50"
    if (rank === 2) return "bg-gray-400/20 border-gray-400/50"
    if (rank === 3) return "bg-amber-600/20 border-amber-600/50"
    return "bg-card border-border"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-sm font-mono text-muted-foreground">#{rank}</span>
  }

  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-center mb-4">Leaderboard</h1>
          <p className="text-muted-foreground text-center mb-12">Top players across all categories</p>

          {!leaderboard || leaderboard.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(index + 1)}`}
                >
                  <div className="w-8 flex justify-center">{getRankIcon(index + 1)}</div>

                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {(player.display_name || player.username || "?").charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{player.display_name || player.username}</p>
                    <p className="text-sm text-muted-foreground">{player.games_played} games played</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{player.total_score.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
