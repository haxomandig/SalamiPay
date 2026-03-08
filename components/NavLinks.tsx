"use client"

import Link from "next/link"
import { useAuth } from "./AuthProvider"

export default function NavLinks() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <>
      <Link href="/dashboard" className="no-underline text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300">
        Dashboard
      </Link>
      <Link href="/create" className="no-underline text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300">
        Create Event
      </Link>
    </>
  )
}
