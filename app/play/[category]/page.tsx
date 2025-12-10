import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizGame } from "@/components/quiz-game"

export default async function PlayPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  const { data: categoryData } = await supabase.from("categories").select("*").eq("slug", category).single()

  if (!categoryData) {
    redirect("/categories")
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("category_id", categoryData.id)
    .order("difficulty")
    // .limit(2)

  const limitedQues = [...(questions ?? [])].sort(() => Math.random() - 0.5);

  const limited = limitedQues.slice(0, 10);

  return <QuizGame category={categoryData} questions={limited || []} userId={user.id} />
}
