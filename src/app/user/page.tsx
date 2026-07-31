import Image from 'next/image'
import { auth } from '@/auth'
import SignOutButton from '../components/SignOutButton'
import Link from 'next/link'

export default async function user() {

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
  } else {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            You are not logged in
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Please go to the home page and log in first.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Go to Home
          </Link>
        </section>
      </main>
    )
  }
}