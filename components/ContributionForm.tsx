"use client"

import { useRef, useState } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "../lib/types"
import type { PaymentMethod } from "../lib/types"

type Props = {
  eventId: string
  guestTracking?: boolean
  onContributionSaved?: () => void
}

export default function ContributionForm({ eventId, guestTracking, onContributionSaved }: Props) {

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash")
  const [guestsSelf, setGuestsSelf] = useState(0)
  const [guestsSpouse, setGuestsSpouse] = useState(0)
  const [guestsChildUnder12, setGuestsChildUnder12] = useState(0)
  const [guestsChildOver12, setGuestsChildOver12] = useState(0)
  const [guestsOther, setGuestsOther] = useState(0)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [cooldown, setCooldown] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const turnstileRef = useRef<TurnstileInstance>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("idle")

    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length > 100) {
      setStatus("error")
      return
    }

    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0 || numAmount > 10_000_000) {
      setStatus("error")
      return
    }

    if (message.length > 500) {
      setStatus("error")
      return
    }

    if (!turnstileToken) {
      setStatus("error")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          name: trimmedName,
          amount: numAmount,
          message,
          payment_method: paymentMethod,
          turnstile_token: turnstileToken,
          ...(guestTracking ? {
            guests_self: guestsSelf,
            guests_spouse: guestsSpouse,
            guests_child_under12: guestsChildUnder12,
            guests_child_over12: guestsChildOver12,
            guests_other: guestsOther,
          } : {}),
        }),
      })

      if (!res.ok) {
        setStatus("error")
      } else {
        setStatus("success")
        setName("")
        setAmount("")
        setMessage("")
        setPaymentMethod("bkash")
        setGuestsSelf(0)
        setGuestsSpouse(0)
        setGuestsChildUnder12(0)
        setGuestsChildOver12(0)
        setGuestsOther(0)
        setCooldown(true)
        setTimeout(() => setCooldown(false), 30_000)
        onContributionSaved?.()
      }
    } catch {
      setStatus("error")
    }

    setLoading(false)
    setTurnstileToken("")
    turnstileRef.current?.reset()
  }

  const inputClass = "w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
  const guestInputClass = "w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-sm"

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">

      {status === "success" && (
        <p className="text-green-600 font-medium">Salami sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-medium">Error sending Salami. Please try again.</p>
      )}

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
        disabled={loading || cooldown}
        className={inputClass}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min="1"
        max="10000000"
        disabled={loading || cooldown}
        className={inputClass}
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              disabled={loading || cooldown}
              onClick={() => setPaymentMethod(method)}
              className={`p-2 text-sm rounded border transition-colors ${
                paymentMethod === method
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400"
              } disabled:opacity-50`}
            >
              {PAYMENT_METHOD_LABELS[method]}
            </button>
          ))}
        </div>
      </div>

      {guestTracking && (
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Guest Count</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Self</label>
              <input
                type="number"
                value={guestsSelf}
                onChange={(e) => setGuestsSelf(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
                min="0" max="10000"
                disabled={loading || cooldown}
                className={guestInputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Spouse</label>
              <input
                type="number"
                value={guestsSpouse}
                onChange={(e) => setGuestsSpouse(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
                min="0" max="10000"
                disabled={loading || cooldown}
                className={guestInputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Children (under 12)</label>
              <input
                type="number"
                value={guestsChildUnder12}
                onChange={(e) => setGuestsChildUnder12(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
                min="0" max="10000"
                disabled={loading || cooldown}
                className={guestInputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Children (over 12)</label>
              <input
                type="number"
                value={guestsChildOver12}
                onChange={(e) => setGuestsChildOver12(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
                min="0" max="10000"
                disabled={loading || cooldown}
                className={guestInputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Other (driver, relatives)</label>
              <input
                type="number"
                value={guestsOther}
                onChange={(e) => setGuestsOther(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
                min="0" max="10000"
                disabled={loading || cooldown}
                className={guestInputClass}
              />
            </div>
          </div>
        </div>
      )}

      <textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        disabled={loading || cooldown}
        className={inputClass}
      />

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setTurnstileToken(token)}
      />

      <p className="text-xs text-gray-500 dark:text-gray-400">
        This records your pledge. Arrange payment directly with the event organizer.
      </p>

      <button
        disabled={loading || cooldown || !turnstileToken}
        className="w-full sm:w-auto px-5 py-3 bg-black text-white rounded-lg border-none disabled:bg-gray-500"
      >
        {cooldown ? "Please wait..." : loading ? "Sending..." : "Send Salami"}
      </button>

    </form>
  )
}
