import { create } from "zustand"
import type { AnswerRecord, Category, Question } from "./types"

const QUESTION_TIME = 30

const getQuestionScore = (question: Question, timeRemaining: number, streak: number) => {
  const speedBonus = Math.max(0, timeRemaining) * 2
  const streakBonus = Math.min(streak, 5) * 25
  return question.difficulty * 100 + speedBonus + streakBonus
}

interface GameState {
  currentCategory: Category | null
  questions: Question[]
  currentQuestionIndex: number
  score: number
  xpEarned: number
  correctAnswers: number
  currentStreak: number
  maxStreak: number
  selectedAnswer: string | null
  isAnswered: boolean
  timeRemaining: number
  startedAt: number | null
  completedAt: number | null
  answerLog: AnswerRecord[]
  gameStarted: boolean
  gameEnded: boolean

  setCategory: (category: Category) => void
  setQuestions: (questions: Question[]) => void
  selectAnswer: (answer: string) => void
  nextQuestion: () => void
  updateTime: (time: number) => void
  tick: () => void
  startGame: () => void
  endGame: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  currentCategory: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  xpEarned: 0,
  correctAnswers: 0,
  currentStreak: 0,
  maxStreak: 0,
  selectedAnswer: null,
  isAnswered: false,
  timeRemaining: QUESTION_TIME,
  startedAt: null,
  completedAt: null,
  answerLog: [],
  gameStarted: false,
  gameEnded: false,

  setCategory: (category) => set({ currentCategory: category }),

  setQuestions: (questions) => set({ questions }),

  selectAnswer: (answer) => {
    const { questions, currentQuestionIndex, currentStreak, isAnswered, timeRemaining } = get()
    if (isAnswered) return

    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    const isCorrect = answer === currentQuestion.correct_answer
    const nextStreak = isCorrect ? currentStreak + 1 : 0
    const earnedScore = isCorrect ? getQuestionScore(currentQuestion, timeRemaining, nextStreak) : 0
    const earnedXp = isCorrect ? currentQuestion.difficulty * 20 + Math.max(0, timeRemaining) : 5

    set((state) => ({
      selectedAnswer: answer,
      isAnswered: true,
      score: state.score + earnedScore,
      xpEarned: state.xpEarned + earnedXp,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      currentStreak: nextStreak,
      maxStreak: Math.max(state.maxStreak, nextStreak),
      answerLog: [
        ...state.answerLog,
        {
          question_id: currentQuestion.id,
          selected_answer: answer,
          correct_answer: currentQuestion.correct_answer,
          is_correct: isCorrect,
          time_remaining: timeRemaining,
        },
      ],
    }))
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get()
    if (currentQuestionIndex >= questions.length - 1) {
      set({ gameEnded: true, completedAt: Date.now() })
    } else {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        isAnswered: false,
        timeRemaining: QUESTION_TIME,
      })
    }
  },

  updateTime: (time) => set({ timeRemaining: time }),

  tick: () => {
    const { timeRemaining, isAnswered } = get()
    if (isAnswered) return
    set({ timeRemaining: Math.max(0, timeRemaining - 1) })
  },

  startGame: () =>
    set({
      gameStarted: true,
      timeRemaining: QUESTION_TIME,
      startedAt: Date.now(),
      completedAt: null,
    }),

  endGame: () => set({ gameEnded: true, completedAt: Date.now() }),

  resetGame: () =>
    set({
      currentCategory: null,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      xpEarned: 0,
      correctAnswers: 0,
      currentStreak: 0,
      maxStreak: 0,
      selectedAnswer: null,
      isAnswered: false,
      timeRemaining: QUESTION_TIME,
      startedAt: null,
      completedAt: null,
      answerLog: [],
      gameStarted: false,
      gameEnded: false,
    }),
}))
