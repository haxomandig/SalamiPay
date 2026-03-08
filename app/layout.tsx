import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import AuthButton from "../components/AuthButton";
import ThemeToggle from "../components/ThemeToggle";
import { ToastProvider } from "../components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://salamipay.com"),
  title: "SalamiPay",
  description: "Collect contributions for your group events",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: "SalamiPay",
    type: "website",
    url: "https://salamipay.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <AuthProvider>
        <ToastProvider>
        <nav className="px-4 sm:px-10 py-3 border-b border-gray-200 dark:border-gray-800 flex gap-5 items-center">
          <Link href="/" className="font-bold text-lg no-underline text-inherit">
            SalamiPay
          </Link>
          <Link href="/dashboard" className="no-underline text-gray-500 dark:text-gray-400 text-sm">
            Dashboard
          </Link>
          <Link href="/create" className="no-underline text-gray-500 dark:text-gray-400 text-sm">
            Create Event
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <AuthButton />
          </div>
        </nav>
        <div className="min-h-[calc(100vh-49px)] flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="px-4 sm:px-10 py-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-400">
            <p>SalamiPay — Group contributions made simple.</p>
            <div className="mt-2 flex gap-4">
              <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</Link>
            </div>
          </footer>
        </div>
        </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
