import Link from "next/link"

export default function NotFound() {
  return (
    <main className="p-4 sm:p-10">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="inline-block mt-4 text-blue-600 dark:text-blue-400 underline">Back to home</Link>
    </main>
  )
}
