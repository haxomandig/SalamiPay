import type { Contribution } from "./types"

export function buildCSV(contributions: Contribution[]): string {
  const header = "Name,Amount,Payment Method,Payment Status,Message,Date"
  const rows = contributions.map((c) => {
    const date = new Date(c.created_at).toISOString()
    const name = c.name.replace(/"/g, '""')
    const message = c.message.replace(/"/g, '""').replace(/\n/g, " ")
    return `"${name}","${c.amount}","${c.payment_method}","${c.payment_status}","${message}","${date}"`
  })
  return [header, ...rows].join("\n")
}
