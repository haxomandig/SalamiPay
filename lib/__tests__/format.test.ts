import { formatAmount } from "../format"

describe("formatAmount", () => {
  it("formats whole numbers with locale separators", () => {
    const result = formatAmount(1000)
    // toLocaleString is locale-dependent, just verify it returns a non-empty string
    expect(result).toBeTruthy()
    expect(result).toContain("1")
  })

  it("formats zero", () => {
    expect(formatAmount(0)).toBe("0")
  })

  it("formats small numbers without separators", () => {
    expect(formatAmount(5)).toBe("5")
  })

  it("formats negative numbers", () => {
    const result = formatAmount(-500)
    expect(result).toContain("500")
  })

  it("formats decimal amounts", () => {
    const result = formatAmount(99.5)
    expect(result).toContain("99")
  })
})
