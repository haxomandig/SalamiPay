import { generateBaseSlug, generateSlug } from "../../lib/slug"

describe("generateBaseSlug", () => {
  it("converts to lowercase with hyphens", () => {
    expect(generateBaseSlug("Batch Reunion 2010")).toBe("batch-reunion-2010")
  })

  it("strips diacritics", () => {
    expect(generateBaseSlug("Café Résumé")).toBe("cafe-resume")
  })

  it("removes special characters", () => {
    expect(generateBaseSlug("Hello! @World #2024")).toBe("hello-world-2024")
  })

  it("collapses multiple hyphens", () => {
    expect(generateBaseSlug("a---b   c")).toBe("a-b-c")
  })

  it("trims leading and trailing hyphens", () => {
    expect(generateBaseSlug("  hello  ")).toBe("hello")
    expect(generateBaseSlug("--test--")).toBe("test")
  })

  it("handles empty string", () => {
    expect(generateBaseSlug("")).toBe("")
  })

  it("handles all special characters", () => {
    expect(generateBaseSlug("!!!")).toBe("")
  })

  it("handles unicode characters", () => {
    expect(generateBaseSlug("über cool événement")).toBe("uber-cool-evenement")
  })
})

describe("generateSlug", () => {
  it("appends a 6-char suffix", () => {
    const slug = generateSlug("Test Event")
    expect(slug).toMatch(/^test-event-[a-z0-9]{1,6}$/)
  })

  it("generates different slugs each time", () => {
    const slug1 = generateSlug("Same Name")
    const slug2 = generateSlug("Same Name")
    expect(slug1).not.toBe(slug2)
  })
})
