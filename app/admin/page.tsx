import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PlusCircle, ShieldAlert, SlidersHorizontal } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

async function createCategory(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/profile")

  await supabase.from("categories").insert({
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    icon: String(formData.get("icon") || "globe"),
    color: String(formData.get("color") || "#14b8a6"),
  })

  revalidatePath("/categories")
  revalidatePath("/admin")
}

async function createQuestion(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/profile")

  await supabase.from("questions").insert({
    category_id: String(formData.get("category_id") || ""),
    question: String(formData.get("question") || ""),
    correct_answer: String(formData.get("correct_answer") || ""),
    wrong_answers: String(formData.get("wrong_answers") || "")
      .split(",")
      .map((answer) => answer.trim())
      .filter(Boolean),
    difficulty: Number(formData.get("difficulty") || 1),
    explanation: String(formData.get("explanation") || ""),
  })

  revalidatePath("/admin")
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") {
    return (
      <main className="min-h-screen pt-16">
        <Navbar />
        <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
          <ShieldAlert className="mb-4 size-12 text-muted-foreground" />
          <h1 className="mb-2 text-3xl font-bold">Admin access required</h1>
          <p className="text-muted-foreground">Set your profile role to admin in Supabase to manage quiz content.</p>
        </div>
      </main>
    )
  }

  const [{ data: categories }, { data: questionRows }, { data: users }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("questions").select("id, category_id, difficulty"),
    supabase.from("profiles").select("id, total_score, games_played"),
  ])

  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge className="mb-3 bg-primary/15 text-primary hover:bg-primary/20">Admin</Badge>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold md:text-6xl">
                Quiz Management
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AdminMetric label="Categories" value={categories?.length ?? 0} />
              <AdminMetric label="Questions" value={questionRows?.length ?? 0} />
              <AdminMetric label="Players" value={users?.length ?? 0} />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <form action={createCategory} className="glass-panel rounded-xl p-6">
              <PlusCircle className="mb-4 size-7 text-primary" />
              <h2 className="mb-5 text-2xl font-semibold">Create category</h2>
              <div className="grid gap-4">
                <Field name="name" label="Name" placeholder="Sports" />
                <Field name="slug" label="Slug" placeholder="sports" />
                <Field name="icon" label="Icon key" placeholder="globe" />
                <Field name="color" label="Color" placeholder="#14b8a6" />
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Challenge sports history and records." />
                </div>
                <Button type="submit">Save category</Button>
              </div>
            </form>

            <form action={createQuestion} className="glass-panel rounded-xl p-6">
              <SlidersHorizontal className="mb-4 size-7 text-primary" />
              <h2 className="mb-5 text-2xl font-semibold">Create question</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category_id">Category</Label>
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Field name="question" label="Question" placeholder="What is..." />
                <Field name="correct_answer" label="Correct answer" placeholder="Answer" />
                <Field name="wrong_answers" label="Wrong answers" placeholder="A, B, C" />
                <Field name="difficulty" label="Difficulty" placeholder="1" />
                <div className="grid gap-2">
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea id="explanation" name="explanation" placeholder="Why this answer is correct." />
                </div>
                <Button type="submit">Save question</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} placeholder={placeholder} required />
    </div>
  )
}

function AdminMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-card/80 p-4 text-center">
      <p className="font-mono text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
