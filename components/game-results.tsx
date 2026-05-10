"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Award, Clock, RotateCcw, Share2, Target, Trophy, Zap } from "lucide-react"
import type { Category } from "@/lib/types"
import { useGameStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ConfettiBurst } from "@/components/confetti-burst"

interface GameResultsProps {
  category: Category
  totalQuestions: number
}

export function GameResults({ category, totalQuestions }: GameResultsProps) {
  const { score, correctAnswers, xpEarned, maxStreak, startedAt, completedAt, resetGame } = useGameStore()
  const percentage = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const elapsedSeconds = startedAt && completedAt ? Math.max(1, Math.round((completedAt - startedAt) / 1000)) : 0
  const levelCopy = percentage >= 90 ? "Elite clear" : percentage >= 70 ? "Strong run" : percentage >= 50 ? "Solid effort" : "Training run"

  const handleShare = async () => {
    const text = `I scored ${score} in ${category.name} on QuizVerse with ${percentage}% accuracy.`
    if (navigator.share) {
      await navigator.share({ title: "QuizVerse result", text })
      return
    }
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background p-4">
      {percentage >= 70 && <ConfettiBurst />}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.20),transparent_34%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.16),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center py-10">
        <div className="grid w-full gap-5 lg:grid-cols-[0.85fr_1fr]">
          <div className="glass-panel rounded-xl p-6">
            <Award className="mb-5 size-10 text-accent" />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{levelCopy}</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl">
              {category.name} complete
            </h1>
            <p className="mt-4 leading-7 text-muted-foreground">
              You answered {correctAnswers} of {totalQuestions} correctly and earned {xpEarned} XP.
            </p>
            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-mono font-bold">{percentage}%</span>
              </div>
              <Progress value={percentage} />
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-card/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultStat icon={<Trophy className="size-5" />} label="Score" value={score.toLocaleString()} />
              <ResultStat icon={<Target className="size-5" />} label="Correct" value={`${correctAnswers}/${totalQuestions}`} />
              <ResultStat icon={<Zap className="size-5" />} label="XP" value={`+${xpEarned}`} />
              <ResultStat icon={<Clock className="size-5" />} label="Time" value={`${elapsedSeconds}s`} />
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-background/45 p-5">
              <p className="mb-2 text-sm text-muted-foreground">Best streak</p>
              <div className="flex items-end gap-2">
                <span className="font-mono text-5xl font-bold">{maxStreak}</span>
                <span className="pb-2 text-muted-foreground">answers in a row</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="h-12">
                <Link href={`/play/${category.slug}`} onClick={() => resetGame()}>
                  <RotateCcw className="size-4" />
                  Play Again
                </Link>
              </Button>
              <Button type="button" variant="outline" size="lg" className="h-12 bg-transparent" onClick={handleShare}>
                <Share2 className="size-4" />
                Share Result
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-12">
                <Link href="/categories">Try Another Category</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-background/45 p-4">
      <div className="mb-3 text-primary">{icon}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold">{value}</p>
    </div>
  )
}
