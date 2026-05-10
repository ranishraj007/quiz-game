"use client"

import { useEffect, useCallback, useMemo } from "react"
import { useGameStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock3, Flame, Sparkles, XCircle } from "lucide-react"

export function QuestionCard() {
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isAnswered,
    timeRemaining,
    score,
    currentStreak,
    selectAnswer,
    nextQuestion,
    tick,
  } = useGameStore()

  const currentQuestion = questions[currentQuestionIndex]
  const allAnswers = useMemo(() => {
    if (!currentQuestion) return []
    return [currentQuestion.correct_answer, ...currentQuestion.wrong_answers].sort(() => Math.random() - 0.5)
  }, [currentQuestion])

  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      selectAnswer("")
    }
  }, [isAnswered, selectAnswer])

  useEffect(() => {
    if (isAnswered) return

    const timer = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(timer)
  }, [isAnswered, tick])

  useEffect(() => {
    if (timeRemaining <= 0 && !isAnswered) {
      handleTimeUp()
    }
  }, [handleTimeUp, isAnswered, timeRemaining])

  if (!currentQuestion) {
    return null
  }

  const getAnswerStyle = (answer: string) => {
    if (!isAnswered) {
      return "border-white/15 bg-white/10 hover:-translate-y-0.5 hover:border-primary/70 hover:bg-white/15 focus-visible:ring-primary/50"
    }
    if (answer === currentQuestion.correct_answer) {
      return "border-emerald-400 bg-emerald-500/20 text-emerald-50"
    }
    if (answer === selectedAnswer && answer !== currentQuestion.correct_answer) {
      return "border-rose-400 bg-rose-500/20 text-rose-50"
    }
    return "border-white/10 bg-white/5 opacity-50"
  }

  const progress = ((currentQuestionIndex + Number(isAnswered)) / questions.length) * 100
  const timePercent = (timeRemaining / 30) * 100
  const answerWasCorrect = selectedAnswer === currentQuestion.correct_answer

  return (
    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-5 grid gap-3 px-1 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:w-56">
          <div className="rounded-lg border border-white/10 bg-background/60 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-amber-300" />
              Score
            </div>
            <p className="font-mono text-lg font-bold text-primary">{score}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-background/60 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame className="size-3.5 text-orange-300" />
              Streak
            </div>
            <p className="font-mono text-lg font-bold">{currentStreak}x</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-full border border-white/10 bg-background/50 px-4 py-2 text-sm backdrop-blur">
        <div className="text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className={cn("size-4", timeRemaining <= 10 ? "text-destructive" : "text-cyan-300")} />
          <span
            className={cn("font-mono font-bold", timeRemaining <= 10 ? "text-destructive" : "text-foreground")}
          >
            {timeRemaining}s
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/15 bg-card/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <Progress
          value={timePercent}
          aria-label={`${timeRemaining} seconds remaining`}
          className={cn("h-1 rounded-none bg-white/10", timeRemaining <= 10 && "[&>div]:bg-destructive")}
        />
        <div className="p-5 sm:p-7">
        {currentQuestion.media_url && currentQuestion.media_type === "flag" && (
          <div className="mb-6 flex justify-center rounded-xl border border-white/10 bg-white/5 p-4">
            <img
              src={currentQuestion.media_url || "/placeholder.svg"}
              alt="Question clue"
              className="h-28 w-auto rounded-md border border-white/15 shadow-lg sm:h-36"
            />
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            {currentQuestion.difficulty === 1 ? "Warm up" : currentQuestion.difficulty === 2 ? "Skilled" : "Expert"}
          </span>
          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-200">
            +{currentQuestion.difficulty * 100} base points
          </span>
        </div>

        <h2 className="mb-8 text-center text-2xl font-semibold leading-tight text-balance md:text-3xl">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allAnswers.map((answer, index) => (
            <button
              key={answer}
              onClick={() => !isAnswered && selectAnswer(answer)}
              disabled={isAnswered}
              aria-label={`Answer ${String.fromCharCode(65 + index)}: ${answer}`}
              className={cn(
                "group min-h-20 rounded-lg border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-default",
                getAnswerStyle(answer),
                !isAnswered && "cursor-pointer",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/60 font-mono text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium leading-snug">{answer}</span>
                {isAnswered && answer === currentQuestion.correct_answer && (
                  <CheckCircle2 className="ml-auto size-5 text-emerald-300" />
                )}
                {isAnswered && answer === selectedAnswer && answer !== currentQuestion.correct_answer && (
                  <XCircle className="ml-auto size-5 text-rose-300" />
                )}
              </span>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="mt-6 rounded-xl border border-white/10 bg-background/50 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              {answerWasCorrect ? (
                <CheckCircle2 className="size-5 text-emerald-300" />
              ) : (
                <XCircle className="size-5 text-rose-300" />
              )}
              {answerWasCorrect ? "Nice hit." : selectedAnswer ? "Not this time." : "Time expired."}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {currentQuestion.explanation ||
                `Correct answer: ${currentQuestion.correct_answer}. Keep the streak alive on the next one.`}
            </p>
            <Button onClick={nextQuestion} size="lg" className="mt-5 w-full sm:w-auto">
              {currentQuestionIndex >= questions.length - 1 ? "See Results" : "Next Question"}
            </Button>
          </div>
        )}
        </div>
      </div>

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
