'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { formatAmount } from '../../lib/format'
import type { Event } from '../../lib/types'
import { useAuth } from '../../components/AuthProvider'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const pageSize = 10

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (authLoading || !user) return

    let cancelled = false

    async function fetchMyEvents() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false })

      if (!cancelled) {
        if (data) setMyEvents(data)
        setLoading(false)
      }
    }
    fetchMyEvents()

    return () => { cancelled = true }
  }, [user, authLoading])

  // Show nothing while checking auth
  if (authLoading || !user) {
    return (
      <main className="p-4 sm:p-10">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800 rounded mt-4" />
        </div>
      </main>
    )
  }

  const filtered = myEvents.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / pageSize)
  const safePage = Math.min(page, Math.max(totalPages - 1, 0))

  return (
    <main className="p-4 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link
          href="/create"
          className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 no-underline"
        >
          + Create Event
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search your events..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        className="mt-4 p-2 text-sm border border-gray-300 dark:border-gray-700 rounded w-full max-w-xs bg-white dark:bg-gray-900 dark:text-gray-100"
      />

      <div className="mt-5">
        {loading ? (
          <ul className="list-none p-0">
            {[1, 2, 3].map((i) => (
              <li key={i} className="py-3 border-b border-gray-200 dark:border-gray-800 animate-pulse">
                <div className="h-4 w-48 max-w-full bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-64 max-w-full bg-gray-100 dark:bg-gray-800 rounded mt-2" />
              </li>
            ))}
          </ul>
        ) : myEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">You haven&apos;t created any events yet.</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Create your first event to start collecting contributions.</p>
            <Link
              href="/create"
              className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 no-underline"
            >
              Create Your First Event
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No events match your search.</p>
        ) : (
          <>
            <ul className="list-none p-0">
              {filtered.slice(safePage * pageSize, (safePage + 1) * pageSize).map((event) => (
                <li key={event.id} className="py-3 border-b border-gray-200 dark:border-gray-800">
                  <Link href={`/event/${event.slug}`} className="no-underline text-inherit">
                    <strong>{event.name}</strong>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.target_amount != null ? `Target: ${formatAmount(event.target_amount)} — ` : ""}{event.participants} participants — Created {new Date(event.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                <span className="text-sm text-gray-500">{safePage + 1} / {totalPages}</span>
                <button disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Next</button>
              </div>
            )}
            <p className="mt-3 text-sm text-gray-400">{myEvents.length} event{myEvents.length !== 1 ? 's' : ''} total</p>
          </>
        )}
      </div>
    </main>
  )
}
