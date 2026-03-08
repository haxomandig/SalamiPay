'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { formatAmount } from '../../lib/format'
import type { Event } from '../../lib/types'
import { useAuth } from '../../components/AuthProvider'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [myLoading, setMyLoading] = useState(true)
  const [myPage, setMyPage] = useState(0)
  const [allPage, setAllPage] = useState(0)
  const [search, setSearch] = useState("")
  const pageSize = 10

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })

      if (data) setEvents(data)
      setLoading(false)
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function fetchMyEvents() {
      if (!user) {
        if (!cancelled) {
          setMyEvents([])
          setMyLoading(false)
        }
        return
      }

      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false })

      if (!cancelled) {
        if (data) setMyEvents(data)
        setMyLoading(false)
      }
    }
    fetchMyEvents()

    return () => { cancelled = true }
  }, [user, authLoading])

  return (
    <main className="p-4 sm:p-10">
      <h1 className="text-2xl font-bold">Welcome to SalamiPay</h1>

      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The easiest way to collect and manage money for events,
        reunions, trips and group activities.
      </p>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setMyPage(0); setAllPage(0) }}
        className="mt-4 p-2 text-sm border border-gray-300 dark:border-gray-700 rounded w-full max-w-xs bg-white dark:bg-gray-900 dark:text-gray-100"
      />

      {user && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold">My Events</h2>
          {myLoading ? (
            <ul className="list-none p-0">
              {[1, 2].map((i) => (
                <li key={i} className="py-3 border-b border-gray-200 dark:border-gray-800 animate-pulse">
                  <div className="h-4 w-48 max-w-full bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 w-64 max-w-full bg-gray-100 dark:bg-gray-800 rounded mt-2" />
                </li>
              ))}
            </ul>
          ) : myEvents.length > 0 ? (
            (() => {
              const filtered = myEvents.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
              const totalPages = Math.ceil(filtered.length / pageSize)
              const safePage = Math.min(myPage, Math.max(totalPages - 1, 0))
              return filtered.length > 0 ? (
            <>
            <ul className="list-none p-0">
              {filtered.slice(safePage * pageSize, (safePage + 1) * pageSize).map((event) => (
                <li key={event.id} className="py-3 border-b border-gray-200 dark:border-gray-800">
                  <Link href={`/event/${event.slug}`} className="no-underline text-inherit">
                    <strong>{event.name}</strong>
                    <p className="mt-1 text-sm text-gray-500">
                      Target: {formatAmount(event.target_amount)} — {event.participants} participants — Created {new Date(event.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button disabled={safePage === 0} onClick={() => setMyPage(safePage - 1)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                  <span className="text-sm text-gray-500">{safePage + 1} / {totalPages}</span>
                  <button disabled={safePage >= totalPages - 1} onClick={() => setMyPage(safePage + 1)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Next</button>
                </div>
            )}
            </>
              ) : (
                <p className="text-gray-500">No matching events.</p>
              )
            })()
          ) : (
            <p className="text-gray-500">You haven&apos;t created any events yet.</p>
          )}
        </div>
      )}

      <div className="mt-5">
        <h2 className="text-xl font-semibold">All Events</h2>
        {loading ? (
          <ul className="list-none p-0">
            {[1, 2, 3].map((i) => (
              <li key={i} className="py-3 border-b border-gray-200 dark:border-gray-800 animate-pulse">
                <div className="h-4 w-48 max-w-full bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-3 w-64 max-w-full bg-gray-100 dark:bg-gray-800 rounded mt-2" />
              </li>
            ))}
          </ul>
        ) : events.length > 0 ? (
          (() => {
            const filtered = events.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
            const totalPages = Math.ceil(filtered.length / pageSize)
            const safePage = Math.min(allPage, Math.max(totalPages - 1, 0))
            return filtered.length > 0 ? (
          <>
          <ul className="list-none p-0">
            {filtered.slice(safePage * pageSize, (safePage + 1) * pageSize).map((event) => (
              <li key={event.id} className="py-3 border-b border-gray-200 dark:border-gray-800">
                <Link href={`/event/${event.slug}`} className="no-underline text-inherit">
                  <strong>{event.name}</strong>
                  <p className="mt-1 text-sm text-gray-500">
                    Target: {formatAmount(event.target_amount)} — {event.participants} participants — Created {new Date(event.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button disabled={safePage === 0} onClick={() => setAllPage(safePage - 1)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                <span className="text-sm text-gray-500">{safePage + 1} / {totalPages}</span>
                <button disabled={safePage >= totalPages - 1} onClick={() => setAllPage(safePage + 1)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">Next</button>
              </div>
          )}
          </>
            ) : (
              <p className="text-gray-500">No matching events.</p>
            )
          })()
        ) : (
          <p className="text-gray-500">No events yet. Create one to get started!</p>
        )}
      </div>
    </main>
  );
}