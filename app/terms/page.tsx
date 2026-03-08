import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — SalamiPay",
}

export default function TermsOfService() {
  return (
    <main className="p-4 sm:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: March 8, 2026</p>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">1. Service Description</h2>
          <p className="mt-2">SalamiPay is a platform for organizing group contributions. It allows users to create events with funding targets and track contribution pledges from participants. SalamiPay does not process, hold, or transfer any money.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">2. No Financial Services</h2>
          <p className="mt-2">SalamiPay is a record-keeping and coordination tool, not a payment processor or financial institution. All actual payments must be arranged directly between event organizers and contributors through their own chosen payment methods. SalamiPay bears no responsibility for any financial transactions, disputes, or losses arising from arrangements made between users.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">3. User Accounts</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You must provide a valid email address to create an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>Event creation requires a verified account. Contributing to events does not require an account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">4. Acceptable Use</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Use the platform for fraudulent, illegal, or deceptive purposes.</li>
            <li>Create events intended to scam or deceive contributors.</li>
            <li>Submit false or misleading contribution information.</li>
            <li>Attempt to abuse, spam, or overload the platform.</li>
            <li>Impersonate other users or provide false identity information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">5. Content and Data</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Event pages and contributions are publicly visible to anyone with the event link.</li>
            <li>Event creators can delete their events and all associated data at any time.</li>
            <li>We reserve the right to remove content that violates these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">6. Disclaimer of Warranties</h2>
          <p className="mt-2">SalamiPay is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted service, data accuracy, or that the platform will meet your specific requirements.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">7. Limitation of Liability</h2>
          <p className="mt-2">SalamiPay and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to financial losses from payment arrangements made between users.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">8. Changes to Terms</h2>
          <p className="mt-2">We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">9. Contact</h2>
          <p className="mt-2">For questions about these terms, contact us at: <strong>support@salamipay.com</strong></p>
        </section>
      </div>
    </main>
  )
}
