import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://quizverse.example.com"),
  title: {
    default: "QuizVerse - Interactive Quiz Arena",
    template: "%s | QuizVerse",
  },
  description:
    "A modern quiz-game platform with timed challenges, XP, streaks, leaderboards, profiles, and immersive categories.",
  applicationName: "QuizVerse",
  keywords: ["quiz app", "trivia game", "leaderboard", "Supabase", "Next.js"],
  authors: [{ name: "QuizVerse" }],
  creator: "QuizVerse",
  openGraph: {
    title: "QuizVerse",
    description: "Timed quiz battles, XP, streaks, achievements, and leaderboard progression.",
    type: "website",
    siteName: "QuizVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuizVerse",
    description: "Timed quiz battles, XP, streaks, achievements, and leaderboard progression.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#080b12" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
