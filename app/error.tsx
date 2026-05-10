"use client"

import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-lg rounded-xl p-8 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Something broke</p>
        <h1 className="mb-3 text-3xl font-bold">The quiz engine hit a snag.</h1>
        <p className="mb-6 text-sm leading-6 text-muted-foreground">{error.message}</p>
        <Button type="button" onClick={reset}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    </main>
  )
}
