import { Navbar } from "@/components/navbar"
import { CategoryGrid } from "@/components/category-grid"
import { Badge } from "@/components/ui/badge"

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[1fr_0.75fr] md:items-end">
            <div>
              <Badge className="mb-4 bg-primary/15 text-primary hover:bg-primary/20">Quiz arenas</Badge>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-6xl">
                Choose Your Category
              </h1>
            </div>
            <p className="text-lg leading-8 text-muted-foreground">
              Pick a subject, enter a timed run, and build your score with speed, accuracy, and streak control.
          </p>
          </div>
          <CategoryGrid />
        </div>
      </section>
    </main>
  )
}
