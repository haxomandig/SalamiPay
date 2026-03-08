import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ContributionForm from "../../components/ContributionForm"

// Mock @marsidev/react-turnstile — auto-triggers onSuccess with a fake token
jest.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => {
    // Simulate successful CAPTCHA immediately
    setTimeout(() => onSuccess("fake-turnstile-token"), 0)
    return <div data-testid="turnstile-mock" />
  },
}))

// Mock fetch for /api/contribute
const mockFetch = jest.fn()
beforeAll(() => {
  global.fetch = mockFetch
})

describe("ContributionForm", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
  })

  it("renders all form fields", async () => {
    await act(async () => {
      render(<ContributionForm eventId="test-id" />)
    })

    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Message (optional)")).toBeInTheDocument()
  })

  it("renders all 5 payment method buttons", async () => {
    await act(async () => {
      render(<ContributionForm eventId="test-id" />)
    })

    expect(screen.getByText("bKash")).toBeInTheDocument()
    expect(screen.getByText("Nagad")).toBeInTheDocument()
    expect(screen.getByText("Cash")).toBeInTheDocument()
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument()
    expect(screen.getByText("Other")).toBeInTheDocument()
  })

  it("shows success message after submission", async () => {
    const user = userEvent.setup()
    await act(async () => {
      render(<ContributionForm eventId="test-id" />)
    })

    await user.type(screen.getByPlaceholderText("Your Name"), "Alice")
    await user.type(screen.getByPlaceholderText("Amount"), "500")
    await user.click(screen.getByText("Send Salami"))

    expect(await screen.findByText("Salami sent successfully!")).toBeInTheDocument()
  })

  it("shows error message on failure", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({ error: "Failed" }) })
    const user = userEvent.setup()
    await act(async () => {
      render(<ContributionForm eventId="test-id" />)
    })

    await user.type(screen.getByPlaceholderText("Your Name"), "Alice")
    await user.type(screen.getByPlaceholderText("Amount"), "500")
    await user.click(screen.getByText("Send Salami"))

    expect(await screen.findByText("Error sending Salami. Please try again.")).toBeInTheDocument()
  })

  it("calls onContributionSaved after success", async () => {
    const onSaved = jest.fn()
    const user = userEvent.setup()
    await act(async () => {
      render(<ContributionForm eventId="test-id" onContributionSaved={onSaved} />)
    })

    await user.type(screen.getByPlaceholderText("Your Name"), "Alice")
    await user.type(screen.getByPlaceholderText("Amount"), "500")
    await user.click(screen.getByText("Send Salami"))

    await screen.findByText("Salami sent successfully!")
    expect(onSaved).toHaveBeenCalledTimes(1)
  })

  it("clears form after successful submission", async () => {
    const user = userEvent.setup()
    await act(async () => {
      render(<ContributionForm eventId="test-id" />)
    })

    const nameInput = screen.getByPlaceholderText("Your Name")
    const amountInput = screen.getByPlaceholderText("Amount")

    await user.type(nameInput, "Alice")
    await user.type(amountInput, "500")
    await user.click(screen.getByText("Send Salami"))

    await screen.findByText("Salami sent successfully!")
    expect(nameInput).toHaveValue("")
    expect(amountInput).toHaveValue(null)
  })

  it("sends correct data to API", async () => {
    const user = userEvent.setup()
    await act(async () => {
      render(<ContributionForm eventId="evt-123" />)
    })

    await user.type(screen.getByPlaceholderText("Your Name"), "Bob")
    await user.type(screen.getByPlaceholderText("Amount"), "1000")
    await user.type(screen.getByPlaceholderText("Message (optional)"), "Great event")
    await user.click(screen.getByText("Nagad"))
    await user.click(screen.getByText("Send Salami"))

    await screen.findByText("Salami sent successfully!")
    expect(mockFetch).toHaveBeenCalledWith("/api/contribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: "evt-123",
        name: "Bob",
        amount: 1000,
        message: "Great event",
        payment_method: "nagad",
        turnstile_token: "fake-turnstile-token",
      }),
    })
  })
})
