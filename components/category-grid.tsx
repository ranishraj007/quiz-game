import type React from "react";
import Link from "next/link";
import { ArrowRight, Atom, Globe, Heart, Landmark, Music, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe className="w-8 h-8" />,
  music: <Music className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  atom: <Atom className="w-8 h-8" />,
  landmark: <Landmark className="w-8 h-8" />,
  song: <Music className="w-8 h-8" />,
};

const colorMap: Record<string, string> = {
  geography: "bg-geography/20 border-geography/50 hover:bg-geography/30",
  music: "bg-music/20 border-music/50 hover:bg-music/30",
  health: "bg-health/20 border-health/50 hover:bg-health/30",
  science: "bg-science/20 border-science/50 hover:bg-science/30",
  history: "bg-history/20 border-history/50 hover:bg-history/30",
  song: "bg-country/20 border-country/50 hover:bg-country/30",
};

export async function CategoryGrid() {
  const supabase = await createClient();
  const [{ data: categories }, { data: questions }] = await Promise.all([
    supabase
    .from("categories")
    .select("*")
      .order("name"),
    supabase.from("questions").select("category_id, difficulty"),
  ]);

  const questionStats = new Map<string, { total: number; hard: number }>();
  questions?.forEach((question) => {
    const current = questionStats.get(question.category_id) ?? { total: 0, hard: 0 };
    questionStats.set(question.category_id, {
      total: current.total + 1,
      hard: current.hard + (question.difficulty >= 2 ? 1 : 0),
    });
  });

  if (!categories || categories.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-10 text-center">
        <Sparkles className="mx-auto mb-4 size-10 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold">No categories yet</h3>
        <p className="mx-auto max-w-md text-muted-foreground">
          No categories available yet. Run the database scripts to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/play/${category.slug}`}
          className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            colorMap[category.slug] || "bg-card border-border hover:bg-card/80"
          }`}
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="rounded-lg bg-background/50 p-3 text-foreground shadow-inner">
              {iconMap[category.icon] || <Globe className="w-8 h-8" />}
            </div>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            {category.name}
          </h3>
          <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {category.description}
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
            <span className="text-muted-foreground">
              {questionStats.get(category.id)?.total ?? 0} questions
            </span>
            <span className="rounded-full bg-background/60 px-2.5 py-1 font-medium">
              {questionStats.get(category.id)?.hard ?? 0} skilled+
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
