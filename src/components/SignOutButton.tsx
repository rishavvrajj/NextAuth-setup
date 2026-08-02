'use client'

import React from 'react'
import { logOut } from '../../lib/auth'

export default function SignOutButton() {
  
  const handleLogout = async () => {
    await logOut()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-8 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"
    >
      <span className="flex items-center justify-center gap-3">
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M16 17l5-5-5-5v3H9v4h7v3z" />
          <path d="M4 4h7v2H6v12h5v2H4z" />
        </svg>
        <span className="text-base font-medium">Sign out</span>
      </span>
    </button>
  )
}