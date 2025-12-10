import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <CardTitle className="text-xl">Welcome to QuizVerse!</CardTitle>
            <CardDescription>Your account has been created</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Please check your email to confirm your account before signing in.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
