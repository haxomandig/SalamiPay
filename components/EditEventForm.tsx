"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"

type EventData = {
  id: string
  name: string
  target_amount: number
  participants: number
  deadline: string | null
}

type Props = {
  event: EventData
  onSaved: (updated: { name: string; target_amount: number; participants: number; deadline: string | null }) => void
  onCancel: () => void
}

export default function EditEventForm({ event, onSaved, onCancel }: Props) {
  const [editName, setEditName] = useState(event.name)
  const [editTarget, setEditTarget] = useState(String(event.target_amount))
  const [editParticipants, setEditParticipants] = useState(String(event.participants))
  const [editDeadline, setEditDeadline] = useState(event.deadline ? new Date(event.deadline).toISOString().slice(0, 16) : "")
  const [editError, setEditError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEditError("")

    const name = editName.trim()
    const target_amount = Number(editTarget)
    const participants = Number(editParticipants)

    if (!name || name.length > 200) { setEditError("Event name is required (max 200 characters)."); return }
    if (!target_amount || target_amount <= 0 || target_amount > 10_000_000) { setEditError("Target amount must be between 1 and 10,000,000."); return }
    if (!participants || participants <= 0 || !Number.isInteger(participants) || participants > 10_000) { setEditError("Participants must be a whole number between 1 and 10,000."); return }

    const deadline = editDeadline || null

    setSaving(true)
    const { error } = await supabase
      .from("events")
      .update({ name, target_amount, participants, deadline })
      .eq("id", event.id)

    setSaving(false)

    if (error) {
      setEditError("Failed to update event. Please try again.")
    } else {
      onSaved({ name, target_amount, participants, deadline })
    }
  }

  return (
    <form onSubmit={handleSaveEdit} className="mt-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg max-w-md space-y-3">
      <div>
        <label className="block mb-1 text-sm font-medium">Event Name</label>
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 dark:text-gray-100"
          required
          maxLength={200}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Target Amount</label>
        <input
          type="number"
          value={editTarget}
          onChange={(e) => setEditTarget(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 dark:text-gray-100"
          required
          min="1"
          max="10000000"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Participants</label>
        <input
          type="number"
          value={editParticipants}
          onChange={(e) => setEditParticipants(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 dark:text-gray-100"
          required
          min="1"
          max="10000"
          step="1"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Deadline (optional)</label>
        <input
          type="datetime-local"
          value={editDeadline}
          onChange={(e) => setEditDeadline(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      {editError && <p className="text-red-600 text-sm">{editError}</p>}
      <div className="flex gap-2">
        <button
          disabled={saving}
          className="px-4 py-2 text-sm bg-black text-white rounded-lg disabled:bg-gray-500 dark:bg-white dark:text-black"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
