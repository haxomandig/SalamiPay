import type { Contribution } from "./types"

export function buildCSV(contributions: Contribution[]): string {
  const header = "Name,Amount,Payment Method,Payment Status,Self,Spouse,Children (<12),Children (>12),Other Guests,Message,Date"
  const rows = contributions.map((c) => {
    const date = new Date(c.created_at).toISOString()
    const name = c.name.replace(/"/g, '""')
    const message = c.message.replace(/"/g, '""').replace(/\n/g, " ")
    return `"${name}","${c.amount}","${c.payment_method}","${c.payment_status}","${c.guests_self || 0}","${c.guests_spouse || 0}","${c.guests_child_under12 || 0}","${c.guests_child_over12 || 0}","${c.guests_other || 0}","${message}","${date}"`
  })
  return [header, ...rows].join("\n")
}
