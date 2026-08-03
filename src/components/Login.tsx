'use client'

import React, { useEffect } from 'react'
import CredentialSignInButton from './UI/CredentialSignInButton'
import GitHubSignInButton from './UI/GithubSignInButton'
import GoogleSignInButton from './UI/GoogleSignInButton'
import Link from 'next/link'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Login() {

  const router = useRouter();
  const { data: session, status } = useSession();

  // Handle redirect securely in an effect hook
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/user"); // Change to your desired protected route
    }
  }, [status, router]);
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-100 p-4">
      <div className="max-w-6xl overflow-hidden rounded-3xl border-2 border-zinc-300 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10),0_12px_40px_rgba(0,0,0,0.10)]">
        <div className="flex lg:min-h-[90vh] flex-col lg:flex-row">
          
          {/* Left Side */}
          <div className="hidden lg:block lg:w-1/2 m-2 rounded-3xl overflow-hidden cursor-pointer border border-zinc-500 shadow-[0_4px_20px_rgba(0,0,0,0.10),0_12px_40px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.20),0_12px_40px_rgba(0,0,0,0.20)] transition-all duration-300">
            <img
              src="/image.png"
              alt="Login visual"
              className="h-full w-full object-cover hover:scale-101 transition-all duration-300"
            />
          </div>

          {/* Right Side */}
          <div className="flex relative w-full lg:w-1/2 m-2 items-center justify-center p-6 lg:p-10">
            <div className="w-full max-w-lg">
              <CredentialSignInButton />

              <div className="flex items-center justify-center text-zinc-500 my-2">
                <span>or</span>
              </div>

              <div className='space-y-2'>
                <GoogleSignInButton />
                <GitHubSignInButton />
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
                By signing in, you agree to our{' '}
                <Link href="/" className="text-indigo-400 hover:text-indigo-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/" className="text-indigo-400 hover:text-indigo-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Close Button */}

          </div>
        </div>
      </div>
    </main>
  )
}