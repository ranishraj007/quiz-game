"use client"

import type { CSSProperties } from "react"

const pieces = Array.from({ length: 22 }, (_, index) => index)

export function ConfettiBurst() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece}
          className="absolute left-1/2 top-10 size-2 rounded-sm opacity-0"
          style={{
            background: `hsl(${(piece * 37) % 360} 84% 62%)`,
            transform: `rotate(${piece * 17}deg)`,
            animation: `confetti-pop 900ms ${piece * 18}ms ease-out forwards`,
            "--x": `${((piece % 11) - 5) * 22}px`,
            "--y": `${80 + (piece % 5) * 22}px`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
