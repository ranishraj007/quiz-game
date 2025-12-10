import type React from "react"
import Link from "next/link"
import { Globe, Music, Heart, Atom, Landmark } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe className="w-8 h-8" />,
  music: <Music className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  atom: <Atom className="w-8 h-8" />,
  landmark: <Landmark className="w-8 h-8" />,
}

const colorMap: Record<string, string> = {
  geography: "bg-geography/20 border-geography/50 hover:bg-geography/30",
  music: "bg-music/20 border-music/50 hover:bg-music/30",
  health: "bg-health/20 border-health/50 hover:bg-health/30",
  science: "bg-science/20 border-science/50 hover:bg-science/30",
  history: "bg-history/20 border-history/50 hover:bg-history/30",
}

export async function CategoryGrid() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories available yet. Run the database scripts to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/play/${category.slug}`}
          className={`group p-6 rounded-xl border-2 transition-all duration-300 ${colorMap[category.slug] || "bg-card border-border hover:bg-card/80"}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-background/50">
              {iconMap[category.icon] || <Globe className="w-8 h-8" />}
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">{category.name}</h3>
          </div>
          <p className="text-muted-foreground text-sm">{category.description}</p>
          <div className="mt-4 text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
            Start Quiz →
          </div>
        </Link>
      ))}
    </div>
  )
}
