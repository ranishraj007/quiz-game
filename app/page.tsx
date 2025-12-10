import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroScene } from "@/components/hero-scene"
import { CategoryGrid } from "@/components/category-grid"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            QuizVerse
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Explore immersive 3D worlds while testing your knowledge. Each category is a new adventure.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/categories">Start Playing</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-center mb-4">
            Choose Your World
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Each category features a unique 3D environment. Spin the globe for geography, watch vinyl spin for music,
            and more.
          </p>
          <CategoryGrid />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Immersive 3D Worlds"
              description="Each quiz category has its own stunning 3D environment to explore"
              icon="🌍"
            />
            <FeatureCard
              title="Competitive Play"
              description="Climb the leaderboards and challenge players worldwide"
              icon="🏆"
            />
            <FeatureCard
              title="Learn & Have Fun"
              description="Expand your knowledge across multiple subjects while having fun"
              icon="🧠"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
