import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-24">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mb-5 h-10 w-44" />
        <Skeleton className="mb-8 h-20 max-w-2xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </main>
  )
}
