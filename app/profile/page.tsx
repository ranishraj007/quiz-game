import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Trophy, Target, Gamepad2 } from "lucide-react"

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
    .limit(10)

  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {(profile?.display_name || profile?.username || user.email || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                  {profile?.display_name || profile?.username || "Player"}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-background rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{(profile?.total_score || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Score</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <Gamepad2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{profile?.games_played || 0}</p>
                <p className="text-xs text-muted-foreground">Games Played</p>
              </div>
              <div className="bg-background rounded-xl p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">
                  {profile?.games_played ? Math.round(profile.total_score / profile.games_played) : 0}
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold mb-4">Recent Games</h2>

          {!recentGames || recentGames.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No games played yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
                >
                  <div>
                    <p className="font-medium">{(game.categories as { name: string })?.name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">
                      {game.correct_answers}/{game.total_questions} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{game.score}</p>
                    <p className="text-xs text-muted-foreground">{new Date(game.created_at).toLocaleDateString()}</p>
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
