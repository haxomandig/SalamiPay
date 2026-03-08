export type Event = {
  id: string
  name: string
  slug: string
  target_amount: number
  participants: number
  created_by: string | null
  deadline: string | null
  created_at: string
}

export const PAYMENT_METHODS = ["bkash", "nagad", "stripe", "card"] as const
export type PaymentMethod = typeof PAYMENT_METHODS[number]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  stripe: "Stripe",
  card: "Card",
}

export const PAYMENT_STATUSES = ["pending", "completed", "failed"] as const
export type PaymentStatus = typeof PAYMENT_STATUSES[number]

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
}

export type Contribution = {
  id: string
  event_id: string
  name: string
  amount: number
  message: string
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  created_at: string
}
