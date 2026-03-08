export type Event = {
  id: string
  name: string
  slug: string
  target_amount: number | null
  participants: number
  created_by: string | null
  deadline: string | null
  guest_tracking: boolean
  created_at: string
}

export const PAYMENT_METHODS = ["bkash", "nagad", "cash", "bank_transfer", "other"] as const
export type PaymentMethod = typeof PAYMENT_METHODS[number]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  other: "Other",
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
  guests_self: number
  guests_spouse: number
  guests_child_under12: number
  guests_child_over12: number
  guests_other: number
  created_at: string
}
