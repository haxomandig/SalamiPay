"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "./AuthProvider"

export default function AuthButton() {
  const { user, loading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  if (loading) return null

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 hidden sm:inline">{user.email}</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-gray-500 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    )
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Sign in
      </button>
    )
  }

  function closeForm() {
    setShowForm(false)
    setSignUpSuccess(false)
    setResetSuccess(false)
    setError("")
    setMode("signin")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      })
      setSubmitting(false)
      if (resetError) {
        setError(resetError.message)
      } else {
        setResetSuccess(true)
      }
      return
    }

    const { error: authError } = mode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (authError) {
      setError(authError.message)
    } else {
      if (mode === "signup") {
        setError("")
        setSignUpSuccess(true)
      } else {
        closeForm()
        setEmail("")
        setPassword("")
      }
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="absolute right-0 top-0 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg w-72 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">
            {mode === "signin" ? "Sign in" : mode === "signup" ? "Sign up" : "Reset password"}
          </span>
          <button type="button" onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
        </div>

        {signUpSuccess && (
          <div className="p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">Account created! Check your email to verify your account before signing in.</p>
          </div>
        )}
        {resetSuccess && (
          <div className="p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Password reset email sent! Check your inbox for a reset link.</p>
          </div>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 dark:text-gray-100"
        />
        {mode !== "reset" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 dark:text-gray-100"
          />
        )}

        <button
          disabled={submitting}
          className="w-full py-2 text-sm bg-black text-white rounded disabled:bg-gray-500 dark:bg-white dark:text-black dark:disabled:bg-gray-500"
        >
          {submitting
            ? "..."
            : mode === "signin"
            ? "Sign in"
            : mode === "signup"
            ? "Sign up"
            : "Send reset link"}
        </button>

        <div className="space-y-1">
          {mode === "signin" && (
            <>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(""); setResetSuccess(false) }}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Need an account? Sign up
              </button>
              <button
                type="button"
                onClick={() => { setMode("reset"); setError(""); setSignUpSuccess(false) }}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </button>
            </>
          )}
          {mode === "signup" && (
            <button
              type="button"
              onClick={() => { setMode("signin"); setError("") }}
              className="w-full text-xs text-gray-500 hover:text-gray-700"
            >
              Already have an account? Sign in
            </button>
          )}
          {mode === "reset" && (
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); setResetSuccess(false) }}
              className="w-full text-xs text-gray-500 hover:text-gray-700"
            >
              Back to sign in
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
