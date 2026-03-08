"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Contribution } from "../../../lib/types"
import type { PaymentStatus } from "../../../lib/types"
import Link from "next/link"
import ContributionForm from "../../../components/ContributionForm"
import ContributionList from "../../../components/ContributionList"
import EventDashboard from "../../../components/EventDashboard"
import EditEventForm from "../../../components/EditEventForm"
import { supabase } from "../../../lib/supabase"
import { formatAmount } from "../../../lib/format"
import { useAuth } from "../../../components/AuthProvider"
import { buildCSV } from "../../../lib/csv"
import QRCode from "react-qr-code"

type EventData = {
  id: string
  name: string
  target_amount: number | null
  participants: number
  created_by: string | null
  deadline: string | null
  guest_tracking: boolean
  created_at: string
}

export default function EventPageClient({ event: initialEvent }: { event: EventData }) {
  const router = useRouter()
  const { user } = useAuth()
  const [eventData, setEventData] = useState(initialEvent)
  const isOwner = user != null && user.id === eventData.created_by
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadContributions() {
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("event_id", eventData.id)
        .order("created_at", { ascending: false })

      if (!cancelled && !error && data) {
        setContributions(data)
      }
    }

    loadContributions()

    const channel = supabase
      .channel(`contributions:${eventData.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contributions", filter: `event_id=eq.${eventData.id}` },
        (payload) => {
          setContributions((prev) => [payload.new as Contribution, ...prev])
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contributions", filter: `event_id=eq.${eventData.id}` },
        (payload) => {
          const updated = payload.new as Contribution
          setContributions((prev) =>
            prev.map((c) => c.id === updated.id ? updated : c)
          )
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [eventData.id])

  async function updatePaymentStatus(contributionId: string, status: PaymentStatus) {
    setUpdating(contributionId)
    const { error } = await supabase
      .from("contributions")
      .update({ payment_status: status })
      .eq("id", contributionId)

    if (!error) {
      setContributions((prev) =>
        prev.map((c) => c.id === contributionId ? { ...c, payment_status: status } : c)
      )
    }
    setUpdating(null)
  }

  const refetchContributions = useCallback(async () => {
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("event_id", eventData.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setContributions(data)
    }
  }, [eventData.id])

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventData.id)

    if (error) {
      setDeleting(false)
      setConfirmDelete(false)
    } else {
      router.push("/")
    }
  }

  function exportCSV() {
    const csv = buildCSV(contributions)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${eventData.name.replace(/[^a-z0-9]/gi, "_")}_contributions.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasTarget = eventData.target_amount != null && eventData.target_amount > 0
  const totalCollected = contributions
    .filter((c) => c.payment_status === "completed")
    .reduce((sum, c) => sum + c.amount, 0)
  const pendingTotal = contributions
    .filter((c) => c.payment_status === "pending")
    .reduce((sum, c) => sum + c.amount, 0)
  const totalAll = contributions.reduce((sum, c) => sum + c.amount, 0)
  const remaining = hasTarget ? (eventData.target_amount! - totalCollected) : 0
  const fullyFunded = hasTarget && totalCollected >= eventData.target_amount!
  const expired = eventData.deadline != null && new Date(eventData.deadline) < new Date()
  const progressPercent = hasTarget
    ? Math.min((totalCollected / eventData.target_amount!) * 100, 100)
    : 0

  return (
    <main className="p-4 sm:p-10">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Events</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900 dark:text-gray-100">{eventData.name}</span>
      </nav>
      <h1 className="text-2xl font-bold">{eventData.name}</h1>

      {fullyFunded && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 font-semibold">Fully funded! Target of {formatAmount(eventData.target_amount!)} has been reached.</p>
        </div>
      )}

      {expired && !fullyFunded && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 font-semibold">This event&apos;s deadline has passed. Contributions are closed.</p>
        </div>
      )}

      {hasTarget && (
        <p className="mt-2">Target Amount: {formatAmount(eventData.target_amount!)}</p>
      )}
      <p>Participants: {eventData.participants}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {hasTarget && (
          <>Expected per person: {formatAmount(Math.ceil(eventData.target_amount! / eventData.participants))}</>
        )}
        {eventData.created_at && new Date(eventData.created_at).getFullYear() > 1970 && (
          <>{hasTarget ? " — " : ""}Created {new Date(eventData.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</>
        )}
        {eventData.deadline && (
          <> — Deadline: {new Date(eventData.deadline).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</>
        )}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {copied ? "Link copied!" : "Copy event link"}
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className={`px-4 py-2 text-sm rounded-lg border ${
            showQR ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {showQR ? "Hide QR" : "QR Code"}
        </button>
        {isOwner && (
          <>
            <button
              onClick={() => setAdminMode(!adminMode)}
              className={`px-4 py-2 text-sm rounded-lg border ${
                adminMode ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {adminMode ? "Exit admin" : "Manage payments"}
            </button>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {editing ? "Cancel edit" : "Edit event"}
            </button>
            <button
              onClick={exportCSV}
              disabled={contributions.length === 0}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Export CSV
            </button>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg bg-white hover:bg-red-50"
              >
                Delete event
              </button>
            ) : (
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 text-sm border border-red-500 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm delete"}
              </button>
            )}
          </>
        )}
      </div>

      {showQR && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg inline-block">
          <div className="bg-white p-3 rounded">
            <QRCode value={typeof window !== "undefined" ? window.location.href : ""} size={180} />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">Scan to open this event</p>
        </div>
      )}

      {editing && isOwner && (
        <EditEventForm
          event={eventData}
          onSaved={(updated) => {
            setEventData((prev) => ({ ...prev, ...updated }))
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      )}

      {adminMode && isOwner && contributions.length > 0 && (
        <EventDashboard contributions={contributions} guestTracking={eventData.guest_tracking} />
      )}

      <div className="my-5">
        {hasTarget ? (
          <>
            <p>Collected: {formatAmount(totalCollected)} / {formatAmount(eventData.target_amount!)} (Remaining: {formatAmount(remaining > 0 ? remaining : 0)})</p>
            {pendingTotal > 0 && (
              <p className="text-sm text-yellow-600">{formatAmount(pendingTotal)} pending</p>
            )}
            <div className="w-full max-w-md h-5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{Math.round(progressPercent)}%</p>
          </>
        ) : (
          <p>Total Collected: {formatAmount(totalAll)} ({contributions.length} contribution{contributions.length !== 1 ? "s" : ""})</p>
        )}
      </div>

      {eventData.guest_tracking && contributions.length > 0 && (
        <div className="my-5 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h2 className="text-sm font-semibold mb-3">Guest Summary</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: "Self", value: contributions.reduce((s, c) => s + (c.guests_self || 0), 0) },
              { label: "Spouse", value: contributions.reduce((s, c) => s + (c.guests_spouse || 0), 0) },
              { label: "Child (<12)", value: contributions.reduce((s, c) => s + (c.guests_child_under12 || 0), 0) },
              { label: "Child (>12)", value: contributions.reduce((s, c) => s + (c.guests_child_over12 || 0), 0) },
              { label: "Other", value: contributions.reduce((s, c) => s + (c.guests_other || 0), 0) },
            ].map(({ label, value }) => (
              <div key={label} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            ))}
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
              <p className="text-xs text-blue-600">Total</p>
              <p className="text-lg font-bold text-blue-700">
                {contributions.reduce((s, c) => s + (c.guests_self || 0) + (c.guests_spouse || 0) + (c.guests_child_under12 || 0) + (c.guests_child_over12 || 0) + (c.guests_other || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {!expired && !fullyFunded ? (
        <ContributionForm eventId={eventData.id} guestTracking={eventData.guest_tracking} onContributionSaved={refetchContributions} />
      ) : null}

      <ContributionList
        contributions={contributions}
        adminMode={adminMode}
        updating={updating}
        onUpdateStatus={updatePaymentStatus}
      />
    </main>
  )
}
