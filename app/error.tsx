"use client"

import Link from "next/link"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="p-4 sm:p-10">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-gray-500">An unexpected error occurred. Please try again.</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Try again
        </button>
        <Link href="/" className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm">
          Back to home
        </Link>
      </div>
    </main>
  )
}
