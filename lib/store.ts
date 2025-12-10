import { create } from "zustand"
import type { Question, Category } from "./types"

interface GameState {
  // Game state
  currentCategory: Category | null
  questions: Question[]
  currentQuestionIndex: number
  score: number
  correctAnswers: number
  selectedAnswer: string | null
  isAnswered: boolean
  timeRemaining: number
  gameStarted: boolean
  gameEnded: boolean

  // Actions
  setCategory: (category: Category) => void
  setQuestions: (questions: Question[]) => void
  selectAnswer: (answer: string) => void
  nextQuestion: () => void
  updateTime: (time: number) => void
  startGame: () => void
  endGame: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  currentCategory: null,
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  correctAnswers: 0,
  selectedAnswer: null,
  isAnswered: false,
  timeRemaining: 30,
  gameStarted: false,
  gameEnded: false,

  setCategory: (category) => set({ currentCategory: category }),

  setQuestions: (questions) => set({ questions }),

  selectAnswer: (answer) => {
    const { questions, currentQuestionIndex, isAnswered } = get()
    if (isAnswered) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correct_answer

    set((state) => ({
      selectedAnswer: answer,
      isAnswered: true,
      score: isCorrect ? state.score + 100 * currentQuestion.difficulty : state.score,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
    }))
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get()
    if (currentQuestionIndex >= questions.length - 1) {
      set({ gameEnded: true })
    } else {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: null,
        isAnswered: false,
        timeRemaining: 30,
      })
    }
  },

  updateTime: (time) => set({ timeRemaining: time }),

  startGame: () => set({ gameStarted: true, timeRemaining: 30 }),

  endGame: () => set({ gameEnded: true }),

  resetGame: () =>
    set({
      currentCategory: null,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      selectedAnswer: null,
      isAnswered: false,
      timeRemaining: 30,
      gameStarted: false,
      gameEnded: false,
    }),
}))
