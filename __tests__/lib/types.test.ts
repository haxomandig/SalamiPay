import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
} from "../../lib/types"

describe("Payment constants", () => {
  it("has 4 payment methods", () => {
    expect(PAYMENT_METHODS).toHaveLength(4)
    expect(PAYMENT_METHODS).toContain("bkash")
    expect(PAYMENT_METHODS).toContain("nagad")
    expect(PAYMENT_METHODS).toContain("stripe")
    expect(PAYMENT_METHODS).toContain("card")
  })

  it("has labels for every payment method", () => {
    for (const method of PAYMENT_METHODS) {
      expect(PAYMENT_METHOD_LABELS[method]).toBeDefined()
      expect(typeof PAYMENT_METHOD_LABELS[method]).toBe("string")
    }
  })

  it("has 3 payment statuses", () => {
    expect(PAYMENT_STATUSES).toHaveLength(3)
    expect(PAYMENT_STATUSES).toContain("pending")
    expect(PAYMENT_STATUSES).toContain("completed")
    expect(PAYMENT_STATUSES).toContain("failed")
  })

  it("has labels for every payment status", () => {
    for (const status of PAYMENT_STATUSES) {
      expect(PAYMENT_STATUS_LABELS[status]).toBeDefined()
      expect(typeof PAYMENT_STATUS_LABELS[status]).toBe("string")
    }
  })
})
