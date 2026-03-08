import type { Metadata } from "next"
import Link from "next/link"
import { supabase } from "../../../lib/supabase"
import { formatAmount } from "../../../lib/format"
import EventPageClient from "./EventPageClient"

type Props = {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return { title: "Event not found — SalamiPay" }
  }

  return {
    title: `${event.name} — SalamiPay`,
    description: `Contribute to ${event.name}. Target: ${formatAmount(event.target_amount)} with ${event.participants} participants.`,
    openGraph: {
      title: `${event.name} — SalamiPay`,
      description: `Contribute to ${event.name}. Target: ${formatAmount(event.target_amount)} with ${event.participants} participants.`,
      type: "website",
      url: `https://salamipay.com/${slug}`,
      siteName: "SalamiPay",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(event.name)}&target=${event.target_amount}&collected=0&contributors=0`,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return (
      <main className="p-4 sm:p-10">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">This event doesn&apos;t exist or may have been removed.</p>
        <Link href="/" className="inline-block mt-4 text-blue-600 dark:text-blue-400 underline">Back to home</Link>
      </main>
    )
  }

  return <EventPageClient event={event} />
}
