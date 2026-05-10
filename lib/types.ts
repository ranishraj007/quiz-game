export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  question_count?: number
}

export interface Question {
  id: string
  category_id: string
  question: string
  correct_answer: string
  wrong_answers: string[]
  difficulty: number
  explanation?: string
  media_url?: string
  media_type?: string
}

export interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  total_score: number
  games_played: number
  xp?: number
  level?: number
  current_streak?: number
  best_streak?: number
  role?: "player" | "admin"
}

export interface GameSession {
  id: string
  user_id: string
  category_id: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number
  xp_earned?: number
  max_streak?: number
  answers?: AnswerRecord[]
  completed_at?: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  display_name: string
  avatar_url?: string
  total_score: number
  games_played: number
  rank: number
}

export interface AnswerRecord {
  question_id: string
  selected_answer: string
  correct_answer: string
  is_correct: boolean
  time_remaining: number
}

export interface Achievement {
  id: string
  code: string
  name: string
  description: string
  icon: string
  xp_reward: number
}
