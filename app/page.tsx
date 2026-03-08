"use client"

import Link from "next/link"
import { useState } from "react"

/* ───────── FAQ Item ───────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex justify-between items-center text-left font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        {q}
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-5" : "max-h-0"}`}
      >
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

/* ───────── Main Homepage ───────── */
export default function Homepage() {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-36 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Trusted by groups across Bangladesh
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Group contributions
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              made simple.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Create an event, share the link, and collect pledges from your group — reunions, iftars, gifts, or any shared fund. Track progress in real time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 no-underline"
            >
              Create Your Event
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-gray-600 text-gray-300 font-semibold text-lg hover:bg-gray-800 transition-all no-underline"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure payments via SSLCommerz
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cloudflare protected
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ EARLY ADOPTER BANNER ══════════ */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Just Launched
          </p>
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Be among the first to use SalamiPay</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Join the early wave of organizers simplifying group contributions across Bangladesh.
          </p>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">
              Simple 3-Step Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">How SalamiPay Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Create Your Event",
                desc: "Set a name, target amount, and participant count. Get a unique shareable link instantly.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Share the Link",
                desc: "Send your event link via WhatsApp, Facebook, or any platform. Contributors pledge with one tap.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 0m-3.935 0a2.25 2.25 0 00-1.29-.394 2.25 2.25 0 00-1.645.394m3.935-10.628a2.25 2.25 0 103.935 0m-3.935 0a2.25 2.25 0 00-1.29.394 2.25 2.25 0 00-1.645-.394" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Track Progress",
                desc: "Watch contributions come in real-time. Manage payments, export CSV, and see your progress bar fill up.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-colors group">
                <span className="absolute top-6 right-6 text-5xl font-bold text-gray-100 dark:text-gray-800 group-hover:text-emerald-100 dark:group-hover:text-emerald-900/30 transition-colors">
                  {item.step}
                </span>
                <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">
              Everything You Need
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">Built for Group Organizers</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Real-Time Updates", desc: "See contributions appear live as participants pledge. No refresh needed.", icon: "⚡" },
              { title: "Progress Tracking", desc: "Visual progress bar shows how close you are to your target amount.", icon: "📊" },
              { title: "QR Code Sharing", desc: "Generate a QR code for your event — perfect for printed invitations.", icon: "📱" },
              { title: "Payment Admin", desc: "Track payment status (bKash, Nagad, Stripe, Card) for each contributor.", icon: "💳" },
              { title: "CSV Export", desc: "Download your full contributor list as a spreadsheet for offline tracking.", icon: "📋" },
              { title: "Secure by Default", desc: "Email verification, rate limiting, and Cloudflare Turnstile protection.", icon: "🔒" },
            ].map((feat, i) => (
              <div key={i} className="p-6 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                <span className="text-2xl">{feat.icon}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ USE CASES ══════════ */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">
              Use Cases
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">Perfect For Every Group Event</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Batch Reunions", desc: "Collect contributions from classmates for reunion events.", emoji: "🎓" },
              { title: "Iftar Parties", desc: "Organize group iftars during Ramadan with shared funding.", emoji: "🌙" },
              { title: "Group Gifts", desc: "Pool money for birthdays, weddings, or farewell gifts.", emoji: "🎁" },
              { title: "Team Events", desc: "Company outings, team dinners, or office celebrations.", emoji: "🏢" },
            ].map((uc, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-colors">
                <span className="text-4xl">{uc.emoji}</span>
                <h3 className="text-lg font-semibold mt-4 mb-2">{uc.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join SalamiPay — It&apos;s Free</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto mb-12">
            Get started instantly. No credit card required, no setup fees. Just create your event and start collecting.
          </p>

          <div className="max-w-sm mx-auto p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10">
            <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">Free</div>
            <div className="text-gray-500 mt-1 mb-6">to get started</div>
            <ul className="text-left space-y-3 text-sm">
              {[
                "Unlimited events",
                "Unlimited contributors",
                "Real-time tracking",
                "QR code generation",
                "CSV export",
                "Payment status management",
                "Cloudflare security",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/create"
              className="mt-8 block w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-center hover:bg-emerald-400 transition-colors no-underline"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-12">
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div>
            <FAQItem
              q="How does payment work on SalamiPay?"
              a="SalamiPay processes payments securely through SSLCommerz, Bangladesh's leading payment gateway. Contributors can pay via bKash, Nagad, card, or bank transfer — all from within the event page."
            />
            <FAQItem
              q="Is SalamiPay free?"
              a="Yes, SalamiPay is free to use. There are no charges for creating events, tracking contributions, or using any features. We believe group organizing should be accessible to everyone."
            />
            <FAQItem
              q="How do contributors make their pledge?"
              a="You share your event link (e.g., salamipay.com/batch-iftar-52). Contributors open it, enter their name, amount, preferred payment method, and an optional message. The organizer sees it in real time."
            />
            <FAQItem
              q="Can I export contributor data?"
              a="Yes. Event organizers can export the full contributor list as a CSV file, which opens in Excel or Google Sheets. This includes names, amounts, payment methods, and statuses."
            />
            <FAQItem
              q="Is my data secure?"
              a="SalamiPay uses Supabase with row-level security, Cloudflare Turnstile for bot protection, email verification for accounts, and rate limiting to prevent abuse. Only event owners can see admin controls."
            />
            <FAQItem
              q="Can I edit or delete my event?"
              a="Yes. Sign in with the account you used to create the event, and you'll see edit and delete controls on your event page. Only the event creator has admin access."
            />
          </div>
        </div>
      </section>

      {/* ══════════ CTA FOOTER ══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to organize your next group event?
          </h2>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-10">
            Create your event in 30 seconds. Share the link. Watch contributions roll in.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-white text-emerald-700 font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl no-underline"
          >
            Create Your Event — It&apos;s Free
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
