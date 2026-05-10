"use client"

import { useEffect, useCallback, useRef, type ReactNode } from "react"
import { useGameStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { Category, Question } from "@/lib/types"
import { QuizScene } from "./quiz-scene"
import { QuestionCard } from "./question-card"
import { GameResults } from "./game-results"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock3, Flame, Layers3, Play, ShieldCheck, Sparkles, Trophy } from "lucide-react"
import Link from "next/link"

interface QuizGameProps {
  category: Category
  questions: Question[]
  userId: string
}

export function QuizGame({ category, questions, userId }: QuizGameProps) {
  const saveStartedRef = useRef(false)
  const {
    setCategory,
    setQuestions,
    gameStarted,
    gameEnded,
    startGame,
    resetGame,
    score,
    correctAnswers,
    xpEarned,
    maxStreak,
    answerLog,
    startedAt,
    completedAt,
  } = useGameStore()

  useEffect(() => {
    setCategory(category)
    setQuestions([...questions].sort(() => Math.random() - 0.5))

    return () => {
      resetGame()
    }
  }, [category, questions, setCategory, setQuestions, resetGame])

  const saveGameSession = useCallback(async () => {
    if (saveStartedRef.current) return
    saveStartedRef.current = true

    const supabase = createClient()
    const elapsedSeconds =
      startedAt && completedAt ? Math.max(1, Math.round((completedAt - startedAt) / 1000)) : questions.length * 30

    await supabase.from("game_sessions").insert({
      user_id: userId,
      category_id: category.id,
      score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      time_taken: elapsedSeconds,
      xp_earned: xpEarned,
      max_streak: maxStreak,
      answers: answerLog,
      completed_at: new Date().toISOString(),
    })

    const { data: profile } = await supabase
      .from("profiles")
      .select("total_score, games_played, xp, level, current_streak, best_streak")
      .eq("id", userId)
      .single()

    if (profile) {
      const nextXp = (profile.xp ?? 0) + xpEarned
      const nextLevel = Math.max(profile.level ?? 1, Math.floor(nextXp / 1000) + 1)
      await supabase
        .from("profiles")
        .update({
          total_score: profile.total_score + score,
          games_played: profile.games_played + 1,
          xp: nextXp,
          level: nextLevel,
          current_streak: maxStreak > 0 ? (profile.current_streak ?? 0) + 1 : 0,
          best_streak: Math.max(profile.best_streak ?? 0, maxStreak),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
    }
  }, [
    answerLog,
    category.id,
    completedAt,
    correctAnswers,
    maxStreak,
    questions.length,
    score,
    startedAt,
    userId,
    xpEarned,
  ])

  useEffect(() => {
    if (gameEnded) {
      saveGameSession()
    }
  }, [gameEnded, saveGameSession])

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center text-center">
          <Badge variant="outline" className="mb-4">
            No questions yet
          </Badge>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">This arena is still being built.</h1>
          <p className="mb-8 text-muted-foreground">
            Add questions in Supabase or seed the database, then come back for a proper run.
          </p>
          <Button asChild>
            <Link href="/categories">Choose another category</Link>
          </Button>
        </div>
      </main>
    )
  }

  if (!gameStarted) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.18),transparent_30%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center py-10">
          <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <Link
                href="/categories"
                className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to categories
              </Link>

              <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/20">Ranked solo run</Badge>
              <h1 className="mb-4 font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight text-balance md:text-7xl">
                {category.name}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{category.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Stat icon={<Layers3 className="size-5" />} label="Questions" value={questions.length} />
                <Stat icon={<Clock3 className="size-5" />} label="Timer" value="30s" />
                <Stat icon={<Trophy className="size-5" />} label="Mode" value="XP" />
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-card/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Readiness</p>
                  <h2 className="text-2xl font-semibold">Mission brief</h2>
                </div>
                <ShieldCheck className="size-9 text-emerald-300" />
              </div>

              <div className="space-y-5">
                <BriefRow
                  icon={<Sparkles className="size-4" />}
                  title="Scoring"
                  text="Speed, difficulty, and streaks all add bonus points."
                />
                <BriefRow
                  icon={<Flame className="size-4" />}
                  title="Streaks"
                  text="Correct chains unlock stronger XP momentum."
                />
                <BriefRow
                  icon={<Clock3 className="size-4" />}
                  title="Pressure"
                  text="Each question has a 30 second decision window."
                />
              </div>

              <div className="my-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty mix</span>
                  <span className="font-mono">
                    {questions.filter((q) => q.difficulty >= 2).length}/{questions.length}
                  </span>
                </div>
                <Progress value={(questions.filter((q) => q.difficulty >= 2).length / questions.length) * 100} />
              </div>

              <Button size="lg" onClick={startGame} className="h-12 w-full text-base">
                <Play className="size-4" />
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (gameEnded) {
    return <GameResults category={category} totalQuestions={questions.length} />
  }

  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <QuizScene category={category.slug} />
      </div>

      {/* Quiz UI Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <QuestionCard />
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="mb-3 text-primary">{icon}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function BriefRow({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
