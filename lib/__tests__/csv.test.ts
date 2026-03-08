import { buildCSV } from "../csv"
import type { Contribution } from "../types"

function makeContribution(overrides: Partial<Contribution> = {}): Contribution {
  return {
    id: "test-id",
    event_id: "event-id",
    name: "Alice",
    amount: 500,
    message: "Good luck!",
    payment_method: "bkash",
    payment_status: "pending",
    created_at: "2026-01-15T10:30:00Z",
    ...overrides,
  }
}

describe("buildCSV", () => {
  it("generates header row", () => {
    const csv = buildCSV([])
    expect(csv).toBe("Name,Amount,Payment Method,Payment Status,Message,Date")
  })

  it("generates a row for each contribution", () => {
    const csv = buildCSV([makeContribution(), makeContribution({ name: "Bob", amount: 1000 })])
    const lines = csv.split("\n")
    expect(lines).toHaveLength(3) // header + 2 rows
  })

  it("includes correct data in row", () => {
    const csv = buildCSV([makeContribution()])
    const lines = csv.split("\n")
    expect(lines[1]).toContain('"Alice"')
    expect(lines[1]).toContain('"500"')
    expect(lines[1]).toContain('"bkash"')
    expect(lines[1]).toContain('"pending"')
    expect(lines[1]).toContain('"Good luck!"')
  })

  it("escapes double quotes in name", () => {
    const csv = buildCSV([makeContribution({ name: 'Al"ice' })])
    const lines = csv.split("\n")
    expect(lines[1]).toContain('"Al""ice"')
  })

  it("escapes double quotes in message", () => {
    const csv = buildCSV([makeContribution({ message: 'Say "hello"' })])
    const lines = csv.split("\n")
    expect(lines[1]).toContain('Say ""hello""')
  })

  it("replaces newlines in message with spaces", () => {
    const csv = buildCSV([makeContribution({ message: "line1\nline2" })])
    const lines = csv.split("\n")
    // The message should not break the CSV into extra lines
    expect(lines).toHaveLength(2)
    expect(lines[1]).toContain("line1 line2")
  })

  it("handles empty message", () => {
    const csv = buildCSV([makeContribution({ message: "" })])
    const lines = csv.split("\n")
    expect(lines[1]).toContain('""')
  })
})
