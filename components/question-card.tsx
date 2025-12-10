"use client"

import { useEffect, useCallback } from "react"
import { useGameStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function QuestionCard() {
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswered,
    timeRemaining,
    score,
    selectAnswer,
    nextQuestion,
    updateTime,
    endGame,
  } = useGameStore()

  const currentQuestion = questions[currentQuestionIndex]

  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      selectAnswer("")
    }
  }, [isAnswered, selectAnswer])

  useEffect(() => {
    if (isAnswered) return

    const timer = setInterval(() => {
      updateTime(timeRemaining - 1)
      if (timeRemaining <= 1) {
        clearInterval(timer)
        handleTimeUp()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, isAnswered, updateTime, handleTimeUp])

  if (!currentQuestion) {
    return null
  }

  // Shuffle answers
  const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers].sort(() => Math.random() - 0.5)

  const getAnswerStyle = (answer: string) => {
    if (!isAnswered) {
      return "bg-card/90 border-border hover:bg-card hover:border-primary"
    }
    if (answer === currentQuestion.correct_answer) {
      return "bg-green-500/20 border-green-500 text-green-100"
    }
    if (answer === selectedAnswer && answer !== currentQuestion.correct_answer) {
      return "bg-red-500/20 border-red-500 text-red-100"
    }
    return "bg-card/50 border-border opacity-50"
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium">
          Score: <span className="text-primary">{score}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Time</span>
          <span
            className={cn("text-sm font-mono font-bold", timeRemaining <= 10 ? "text-destructive" : "text-foreground")}
          >
            {timeRemaining}s
          </span>
        </div>
        <Progress
          value={(timeRemaining / 30) * 100}
          className={cn("h-2", timeRemaining <= 10 && "[&>div]:bg-destructive")}
        />
      </div>

      {/* Question Card */}
      <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border p-6 shadow-xl">
        {/* Media */}
        {currentQuestion.media_url && currentQuestion.media_type === "flag" && (
          <div className="mb-6 flex justify-center">
            <img
              src={currentQuestion.media_url || "/placeholder.svg"}
              alt="Flag"
              className="h-32 w-auto rounded-lg shadow-lg border border-border"
            />
          </div>
        )}

        {/* Question */}
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-8 text-balance">{currentQuestion.question}</h2>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => !isAnswered && selectAnswer(answer)}
              disabled={isAnswered}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all duration-200",
                getAnswerStyle(answer),
                !isAnswered && "cursor-pointer",
              )}
            >
              <span className="text-sm font-medium">{answer}</span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        {isAnswered && (
          <div className="mt-6 flex justify-center">
            <Button onClick={nextQuestion} size="lg">
              {currentQuestionIndex >= questions.length - 1 ? "See Results" : "Next Question"}
            </Button>
          </div>
        )}
      </div>

      {/* Difficulty indicator */}
      <div className="mt-4 flex justify-center gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn("w-2 h-2 rounded-full", level <= currentQuestion.difficulty ? "bg-primary" : "bg-muted")}
          />
        ))}
      </div>
    </div>
  )
}
