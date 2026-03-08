import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — SalamiPay",
}

export default function PrivacyPolicy() {
  return (
    <main className="p-4 sm:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: March 8, 2026</p>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">1. Information We Collect</h2>
          <p className="mt-2">When you use SalamiPay, we collect:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> Email address and password when you create an account.</li>
            <li><strong>Event information:</strong> Event names, target amounts, participant counts, and deadlines that you provide when creating events.</li>
            <li><strong>Contribution information:</strong> Names, amounts, messages, and preferred payment methods submitted by contributors.</li>
            <li><strong>Usage data:</strong> Basic analytics such as page views, collected automatically by our hosting provider (Vercel).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">2. How We Use Your Information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>To provide the SalamiPay service: creating events, recording contributions, and displaying progress.</li>
            <li>To authenticate you and protect your account.</li>
            <li>To allow event creators to manage their events and view contribution details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">3. Who Can See Your Information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Event pages are public.</strong> Anyone with the event link can see the event details and contribution list (names, amounts, messages, and payment methods).</li>
            <li><strong>Event creators</strong> can additionally see payment status details and export contribution data as CSV.</li>
            <li>Your email address is only visible to you when signed in. It is not displayed on event pages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">4. Data Storage</h2>
          <p className="mt-2">Your data is stored in Supabase (PostgreSQL) with row-level security policies. The application is hosted on Vercel. Both services are based in the United States and comply with industry-standard security practices.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">5. Data Deletion</h2>
          <p className="mt-2">Event creators can delete their events at any time, which also permanently deletes all associated contributions. To request deletion of your account or personal data, contact us at the email below.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">6. Payments</h2>
          <p className="mt-2">SalamiPay does not process payments. The platform records contribution pledges and preferred payment methods. Actual payment arrangements are made directly between contributors and event organizers. SalamiPay is not responsible for any financial transactions between users.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">7. Contact</h2>
          <p className="mt-2">For privacy-related questions or data deletion requests, contact us at: <strong>privacy@salamipay.com</strong></p>
        </section>
      </div>
    </main>
  )
}
