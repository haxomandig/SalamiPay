"use client"

import { useRef, useState } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "../lib/types"
import type { PaymentMethod } from "../lib/types"

export default function ContributionForm({ eventId, onContributionSaved }: { eventId: string, onContributionSaved?: () => void }) {

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash")
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
        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
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
        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
      />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Payment Method</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

      <textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        disabled={loading || cooldown}
        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
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