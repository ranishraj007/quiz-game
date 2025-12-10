import { Navbar } from "@/components/navbar"
import { CategoryGrid } from "@/components/category-grid"

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-center mb-4">
            Choose Your Category
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Select a category to start your quiz adventure. Each world offers unique challenges and visuals.
          </p>
          <CategoryGrid />
        </div>
      </section>
    </main>
  )
}
