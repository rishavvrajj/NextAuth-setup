'use client'

import React from 'react'
import { googlelogIn } from '../../lib/auth';

export default function SignInButton() {
  const handleLogIn = () => {
    googlelogIn();
  };

  return (
    <button
      type="button"
      onClick={handleLogIn}
      className="w-full my-3 cursor-pointer rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"
    >
      <span className="flex items-center justify-center gap-3">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.35 11.1H12v2.9h5.35c-.23 1.45-1 2.7-2.18 3.54v2.95h3.52c2.06-1.9 3.26-4.68 3.26-8.39 0-.7-.06-1.38-.16-2z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.94 0 5.41-.97 7.21-2.63l-3.52-2.95c-.97.65-2.22 1.03-3.69 1.03-2.84 0-5.25-1.92-6.11-4.5H2.26v2.82A10 10 0 0012 22z"
          />
          <path
            fill="#FBBC05"
            d="M5.89 13.95A5.97 5.97 0 015.56 12c0-.68.12-1.34.33-1.95V7.23H2.26A10 10 0 002 12c0 1.61.39 3.13 1.08 4.47l2.81-2.52z"
          />
          <path
            fill="#EA4335"
            d="M12 5.5c1.6 0 3.03.55 4.16 1.63l3.12-3.12C17.4 2.22 14.94 1 12 1A10 10 0 002.26 7.23l3.63 2.82C6.75 7.42 9.16 5.5 12 5.5z"
          />
        </svg>
        <span className="text-base font-medium">Continue with Google</span>
      </span>
    </button>
  );
}