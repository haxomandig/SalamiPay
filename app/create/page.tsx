"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../components/AuthProvider"
import { generateSlug } from "../../lib/slug"

export default function CreateEvent() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [guestTracking, setGuestTracking] = useState(false)
  const [hasTarget, setHasTarget] = useState(true)

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault()
  }, [])

  useEffect(() => {
    if (dirty) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    }
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [dirty, handleBeforeUnload])

  if (!authLoading && !user) {
    return (
      <main className="p-4 sm:p-10">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          You must be signed in to create an event. Use the Sign in button in the top right corner.
        </p>
      </main>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const form = e.target as HTMLFormElement

    const name = (form.elements.namedItem("eventName") as HTMLInputElement).value.trim()
    const targetAmountStr = (form.elements.namedItem("targetAmount") as HTMLInputElement)?.value
    const participantsStr = (form.elements.namedItem("participants") as HTMLInputElement).value
    const deadlineStr = (form.elements.namedItem("deadline") as HTMLInputElement).value

    if (!name || name.length > 200) {
      setError("Event name is required (max 200 characters).")
      return
    }

    let target_amount: number | null = null
    if (hasTarget) {
      target_amount = Number(targetAmountStr)
      if (!target_amount || target_amount <= 0 || target_amount > 10_000_000) {
        setError("Target amount must be between 1 and 10,000,000.")
        return
      }
    }

    const participants = Number(participantsStr)
    if (!participants || participants <= 0 || !Number.isInteger(participants) || participants > 10_000) {
      setError("Number of participants must be a whole number between 1 and 10,000.")
      return
    }

    const slug = generateSlug(name)

    setLoading(true)
    const { data, error: dbError } = await supabase
      .from("events")
      .insert([{ name, slug, target_amount, participants, created_by: user?.id ?? null, deadline: deadlineStr || null, guest_tracking: guestTracking }])
      .select()
    setLoading(false)

    if (dbError) {
      setError("Error creating event. Please try again.")
      console.log(dbError)
    } else {
      setDirty(false)
      router.push(`/event/${data[0].slug}`)
    }
  }

  const inputClass = "w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"

  return (
    <main className="p-4 sm:p-10">
      <h1 className="text-2xl font-bold">Create Event</h1>

      <p className="mt-2 text-gray-600 dark:text-gray-400">Start collecting money for your group event.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-md">

        <div className="mb-5">
          <label className="block mb-1 font-medium">Event Name</label>
          <input
            name="eventName"
            type="text"
            placeholder="Batch Reunion 2010"
            required
            maxLength={200}
            onChange={() => setDirty(true)}
            className={inputClass}
          />
        </div>

        <div className="mb-5">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={hasTarget}
              onChange={(e) => { setHasTarget(e.target.checked); setDirty(true) }}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-700"
            />
            <span className="font-medium">Set a target amount</span>
          </label>
          {hasTarget && (
            <input
              name="targetAmount"
              type="number"
              placeholder="5000"
              required
              min="1"
              max="10000000"
              onChange={() => setDirty(true)}
              className={inputClass}
            />
          )}
          {!hasTarget && (
            <p className="text-xs text-gray-500 dark:text-gray-400">No target — contributors won&apos;t see a progress tracker.</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-1 font-medium">Number of Participants</label>
          <input
            name="participants"
            type="number"
            placeholder="10"
            required
            min="1"
            max="10000"
            step="1"
            onChange={() => setDirty(true)}
            className={inputClass}
          />
        </div>

        <div className="mb-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={guestTracking}
              onChange={(e) => { setGuestTracking(e.target.checked); setDirty(true) }}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-700"
            />
            <span className="font-medium">Enable guest tracking</span>
          </label>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Contributors can specify how many guests (self, spouse, children, others) they are bringing.</p>
        </div>

        <div className="mb-5">
          <label className="block mb-1 font-medium">Deadline (optional)</label>
          <input
            name="deadline"
            type="datetime-local"
            onChange={() => setDirty(true)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Contributions will be disabled after this date.</p>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          disabled={loading}
          className="w-full sm:w-auto px-5 py-3 bg-black text-white rounded-lg border-none disabled:bg-gray-500"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </main>
  );
}
