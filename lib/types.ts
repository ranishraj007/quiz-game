export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

export interface Question {
  id: string
  category_id: string
  question: string
  correct_answer: string
  wrong_answers: string[]
  difficulty: number
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
}

export interface GameSession {
  id: string
  user_id: string
  category_id: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number
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
