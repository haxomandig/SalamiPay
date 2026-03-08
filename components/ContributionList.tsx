"use client"

import { useState } from "react"
import type { Contribution } from "../lib/types"
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUSES } from "../lib/types"
import type { PaymentStatus } from "../lib/types"
import { formatAmount } from "../lib/format"

type Props = {
  contributions: Contribution[]
  adminMode: boolean
  updating: string | null
  onUpdateStatus: (id: string, status: PaymentStatus) => void
}

export default function ContributionList({ contributions, adminMode, updating, onUpdateStatus }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "name" | "status">("date")
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(0)
  const pageSize = 20

  if (contributions.length === 0) return null

  const statusOrder: Record<string, number> = { pending: 0, completed: 1, failed: 2 }
  const filtered = contributions
    .filter((c) => {
      if (statusFilter !== "all" && c.payment_status !== statusFilter) return false
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === "date") cmp = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      else if (sortBy === "amount") cmp = b.amount - a.amount
      else if (sortBy === "name") cmp = a.name.localeCompare(b.name)
      else if (sortBy === "status") cmp = (statusOrder[a.payment_status] ?? 0) - (statusOrder[b.payment_status] ?? 0)
      return sortAsc ? -cmp : cmp
    })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const safePage = Math.min(page, Math.max(totalPages - 1, 0))
  const paged = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold">Contributions ({contributions.length})</h2>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0) }}
          className="p-2 text-sm border border-gray-300 dark:border-gray-700 rounded w-full sm:w-48 bg-white dark:bg-gray-900 dark:text-gray-100"
        />
        <div className="flex flex-wrap gap-1">
          {(["all", ...PAYMENT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0) }}
              className={`px-3 py-1.5 text-xs rounded-full border ${
                statusFilter === s
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {s === "all" ? "All" : PAYMENT_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 sm:ml-auto">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setPage(0) }}
            className="p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={() => { setSortAsc(!sortAsc); setPage(0) }}
            className="px-2 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            title={sortAsc ? "Ascending" : "Descending"}
          >
            {sortAsc ? "\u2191" : "\u2193"}
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <ul className="list-none p-0">
            {paged.map((c) => (
              <li key={c.id} className="py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span><strong>{c.name}</strong> — {formatAmount(c.amount)}</span>
                    <span className="text-xs text-gray-400">via {PAYMENT_METHOD_LABELS[c.payment_method] ?? c.payment_method}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.payment_status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                      c.payment_status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>{PAYMENT_STATUS_LABELS[c.payment_status] ?? c.payment_status}</span>
                  </span>
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {c.message && <p className="mt-1 text-gray-500 text-sm">{c.message}</p>}
                {adminMode && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {PAYMENT_STATUSES.filter((s) => s !== c.payment_status).map((s) => (
                      <button
                        key={s}
                        disabled={updating === c.id}
                        onClick={() => onUpdateStatus(c.id, s)}
                        className={`text-xs px-2 py-1 rounded border disabled:opacity-50 ${
                          s === "completed" ? "border-green-300 text-green-700 hover:bg-green-50" :
                          s === "failed" ? "border-red-300 text-red-700 hover:bg-red-50" :
                          "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        }`}
                      >
                        {updating === c.id ? "..." : `Mark ${PAYMENT_STATUS_LABELS[s]}`}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                disabled={safePage === 0}
                onClick={() => setPage(safePage - 1)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">{safePage + 1} / {totalPages}</span>
              <button
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage(safePage + 1)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm text-gray-500">No contributions match your filters.</p>
      )}
    </div>
  )
}
