'use server'

import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/auth'
import SignInButton from './components/SignInButton'
import SignOutButton from './components/SignOutButton'

export default async function Home() {
  
  const session = await auth()
  const user = session?.user

  if (user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center text-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                width={72}
                height={72}
                alt={user.name ?? 'User avatar'}
                className="rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                {user.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-400">
                Signed in as <span className="text-zinc-200">{user.name ?? 'User'}</span>
              </p>
            </div>

            <SignOutButton />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome to NextAuth.js
          </h1>
          <p className="text-sm text-zinc-400">
            Sign in to post jobs or apply for opportunities.
          </p>
        </div>

        <div className="mt-8">
          <SignInButton />
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
          By signing in, you agree to our{' '}
          <Link
            href="/terms"
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  )
}