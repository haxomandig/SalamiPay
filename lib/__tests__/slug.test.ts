import { generateBaseSlug, generateSlug } from "../slug"

describe("generateBaseSlug", () => {
  it("converts a simple name to lowercase kebab-case", () => {
    expect(generateBaseSlug("Batch Reunion")).toBe("batch-reunion")
  })

  it("strips accented characters", () => {
    expect(generateBaseSlug("Cafe Reunion")).toBe("cafe-reunion")
    expect(generateBaseSlug("Rene's Party")).toBe("renes-party")
  })

  it("removes special characters", () => {
    expect(generateBaseSlug("Hello! @World #2024")).toBe("hello-world-2024")
  })

  it("collapses multiple spaces and hyphens", () => {
    expect(generateBaseSlug("too   many   spaces")).toBe("too-many-spaces")
    expect(generateBaseSlug("too---many---hyphens")).toBe("too-many-hyphens")
  })

  it("strips leading and trailing hyphens", () => {
    expect(generateBaseSlug("-hello-")).toBe("hello")
    expect(generateBaseSlug("  hello  ")).toBe("hello")
  })

  it("handles empty string", () => {
    expect(generateBaseSlug("")).toBe("")
  })

  it("handles unicode characters", () => {
    expect(generateBaseSlug("Uberraschung")).toBe("uberraschung")
  })

  it("handles all-special-character input", () => {
    expect(generateBaseSlug("!!!@@@###")).toBe("")
  })
})

describe("generateSlug", () => {
  it("appends a 6-character suffix", () => {
    const slug = generateSlug("My Event")
    expect(slug).toMatch(/^my-event-[a-z0-9]{6}$/)
  })

  it("generates unique slugs for the same input", () => {
    const slugs = new Set(Array.from({ length: 20 }, () => generateSlug("Test")))
    // With 36^6 possibilities, 20 should all be unique
    expect(slugs.size).toBe(20)
  })

  it("handles unicode input", () => {
    const slug = generateSlug("Cafe")
    expect(slug).toMatch(/^cafe-[a-z0-9]{6}$/)
  })
})
