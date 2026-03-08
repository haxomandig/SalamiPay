"use client"

import type { Contribution } from "../lib/types"
import { PAYMENT_METHOD_LABELS } from "../lib/types"
import { formatAmount } from "../lib/format"

type Props = {
  contributions: Contribution[]
}

export default function EventDashboard({ contributions }: Props) {
  const totalCollected = contributions
    .filter((c) => c.payment_status === "completed")
    .reduce((sum, c) => sum + c.amount, 0)
  const pendingTotal = contributions
    .filter((c) => c.payment_status === "pending")
    .reduce((sum, c) => sum + c.amount, 0)
  const failedTotal = contributions
    .filter((c) => c.payment_status === "failed")
    .reduce((sum, c) => sum + c.amount, 0)

  const statusCounts = {
    completed: contributions.filter((c) => c.payment_status === "completed").length,
    pending: contributions.filter((c) => c.payment_status === "pending").length,
    failed: contributions.filter((c) => c.payment_status === "failed").length,
  }

  const byMethod = contributions.reduce<Record<string, { count: number; amount: number }>>((acc, c) => {
    const label = PAYMENT_METHOD_LABELS[c.payment_method] ?? c.payment_method
    if (!acc[label]) acc[label] = { count: 0, amount: 0 }
    acc[label].count++
    acc[label].amount += c.amount
    return acc
  }, {})

  return (
    <div className="my-5 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <p className="text-xs text-green-600 font-medium">Completed</p>
          <p className="text-lg font-bold text-green-700">{formatAmount(totalCollected)}</p>
          <p className="text-xs text-green-600">{statusCounts.completed} contribution{statusCounts.completed !== 1 ? "s" : ""}</p>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <p className="text-xs text-yellow-600 font-medium">Pending</p>
          <p className="text-lg font-bold text-yellow-700">{formatAmount(pendingTotal)}</p>
          <p className="text-xs text-yellow-600">{statusCounts.pending} contribution{statusCounts.pending !== 1 ? "s" : ""}</p>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
          <p className="text-xs text-red-600 font-medium">Failed</p>
          <p className="text-lg font-bold text-red-700">{formatAmount(failedTotal)}</p>
          <p className="text-xs text-red-600">{statusCounts.failed} contribution{statusCounts.failed !== 1 ? "s" : ""}</p>
        </div>
      </div>
      {Object.keys(byMethod).length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">By Payment Method</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(byMethod).map(([method, { count, amount }]) => (
              <div key={method} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-500 font-medium">{method}</p>
                <p className="text-sm font-bold">{formatAmount(amount)}</p>
                <p className="text-xs text-gray-400">{count} contribution{count !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
