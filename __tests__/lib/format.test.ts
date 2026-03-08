import { formatAmount } from "../../lib/format"

describe("formatAmount", () => {
  it("formats integers with commas", () => {
    expect(formatAmount(1000)).toBe("1,000")
    expect(formatAmount(1000000)).toBe("1,000,000")
  })

  it("returns simple numbers as-is", () => {
    expect(formatAmount(0)).toBe("0")
    expect(formatAmount(1)).toBe("1")
    expect(formatAmount(999)).toBe("999")
  })

  it("handles decimals", () => {
    expect(formatAmount(1234.56)).toContain("1,234")
  })

  it("handles negative numbers", () => {
    const result = formatAmount(-5000)
    expect(result).toContain("5,000")
  })
})
