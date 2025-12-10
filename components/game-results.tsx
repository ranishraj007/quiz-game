"use client"

import { useGameStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Category } from "@/lib/types"
import { Trophy, Target, Clock, RotateCcw } from "lucide-react"

interface GameResultsProps {
  category: Category
  totalQuestions: number
}

export function GameResults({ category, totalQuestions }: GameResultsProps) {
  const { score, correctAnswers, resetGame } = useGameStore()
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  const getMessage = () => {
    if (percentage >= 90) return "Outstanding!"
    if (percentage >= 70) return "Great job!"
    if (percentage >= 50) return "Good effort!"
    return "Keep practicing!"
  }

  const getEmoji = () => {
    if (percentage >= 90) return "🏆"
    if (percentage >= 70) return "🌟"
    if (percentage >= 50) return "👍"
    return "💪"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <div className="text-6xl mb-4">{getEmoji()}</div>

          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-2">{getMessage()}</h1>
          <p className="text-muted-foreground mb-8">You completed the {category.name} quiz</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-background rounded-xl p-4">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="bg-background rounded-xl p-4">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">
                {correctAnswers}/{totalQuestions}
              </p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-background rounded-xl p-4">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{percentage}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {/* Progress Ring Visual */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${percentage * 3.52} 352`}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{percentage}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href={`/play/${category.slug}`} onClick={() => resetGame()}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
              <Link href="/categories">Try Another Category</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="w-full">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
