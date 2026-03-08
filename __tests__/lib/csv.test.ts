import { buildCSV } from "../../lib/csv"
import type { Contribution } from "../../lib/types"

const mockContribution: Contribution = {
  id: "1",
  event_id: "evt-1",
  name: "Alice",
  amount: 500,
  message: "Happy to help!",
  payment_method: "bkash",
  payment_status: "completed",
  guests_self: 1,
  guests_spouse: 0,
  guests_child_under12: 0,
  guests_child_over12: 0,
  guests_other: 0,
  created_at: "2026-01-15T10:30:00Z",
}

describe("buildCSV", () => {
  it("includes header row", () => {
    const csv = buildCSV([])
    expect(csv).toBe("Name,Amount,Payment Method,Payment Status,Self,Spouse,Children (<12),Children (>12),Other Guests,Message,Date")
  })

  it("generates correct CSV for one contribution", () => {
    const csv = buildCSV([mockContribution])
    const lines = csv.split("\n")
    expect(lines).toHaveLength(2)
    expect(lines[1]).toContain('"Alice"')
    expect(lines[1]).toContain('"500"')
    expect(lines[1]).toContain('"bkash"')
    expect(lines[1]).toContain('"completed"')
    expect(lines[1]).toContain('"Happy to help!"')
  })

  it("escapes double quotes in messages", () => {
    const c: Contribution = { ...mockContribution, message: 'She said "hello"' }
    const csv = buildCSV([c])
    expect(csv).toContain('""hello""')
  })

  it("escapes double quotes in names", () => {
    const c: Contribution = { ...mockContribution, name: 'O"Brien' }
    const csv = buildCSV([c])
    expect(csv).toContain('O""Brien')
  })

  it("replaces newlines in messages with spaces", () => {
    const c: Contribution = { ...mockContribution, message: "Line 1\nLine 2" }
    const csv = buildCSV([c])
    expect(csv).toContain('"Line 1 Line 2"')
    const lines = csv.split("\n")
    expect(lines).toHaveLength(2)
  })

  it("handles multiple contributions", () => {
    const c2: Contribution = { ...mockContribution, id: "2", name: "Bob", amount: 1000 }
    const csv = buildCSV([mockContribution, c2])
    const lines = csv.split("\n")
    expect(lines).toHaveLength(3)
  })

  it("formats date as ISO string", () => {
    const csv = buildCSV([mockContribution])
    expect(csv).toContain("2026-01-15T10:30:00.000Z")
  })

  it("includes guest columns", () => {
    const c: Contribution = { ...mockContribution, guests_self: 1, guests_spouse: 1, guests_child_under12: 2 }
    const csv = buildCSV([c])
    const lines = csv.split("\n")
    expect(lines[1]).toContain('"1"')
    expect(lines[1]).toContain('"2"')
  })
})
