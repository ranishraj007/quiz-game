"use client"

import { useEffect, useCallback } from "react"
import { useGameStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { Category, Question } from "@/lib/types"
import { QuizScene } from "./quiz-scene"
import { QuestionCard } from "./question-card"
import { GameResults } from "./game-results"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface QuizGameProps {
  category: Category
  questions: Question[]
  userId: string
}

export function QuizGame({ category, questions, userId }: QuizGameProps) {
  const { setCategory, setQuestions, gameStarted, gameEnded, startGame, resetGame, score, correctAnswers } =
    useGameStore()

  useEffect(() => {
    setCategory(category)
    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)

    return () => {
      resetGame()
    }
  }, [category, questions, setCategory, setQuestions, resetGame])

  const saveGameSession = useCallback(async () => {
    const supabase = createClient()
    await supabase.from("game_sessions").insert({
      user_id: userId,
      category_id: category.id,
      score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      completed_at: new Date().toISOString(),
    })

    // Update profile stats
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_score, games_played")
      .eq("id", userId)
      .single()

    if (profile) {
      await supabase
        .from("profiles")
        .update({
          total_score: profile.total_score + score,
          games_played: profile.games_played + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
    }
  }, [userId, category.id, score, questions.length, correctAnswers])

  useEffect(() => {
    if (gameEnded) {
      saveGameSession()
    }
  }, [gameEnded, saveGameSession])

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to categories
          </Link>

          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-muted-foreground mb-8">{category.description}</p>

          <div className="bg-card rounded-xl p-6 mb-8 border border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time per question</p>
                <p className="text-2xl font-bold">30s</p>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={startGame} className="w-full text-lg">
            Start Quiz
          </Button>
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
