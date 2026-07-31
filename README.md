# NextAuth-setup – Next.js 15 Auth.js + Prisma starter

A clean Next.js 15 App Router starter for authentication using Auth.js / NextAuth.js, Prisma (Postgres + PrismaPg adapter), and protected routes via a proxy/middleware pattern. Use this as a reference to wire the same setup into your own Next.js application.

---

## 1. Install dependencies (in your own app)

```bash
# Prisma core (dev)
npm install prisma tsx @types/pg --save-dev

# Prisma client + Postgres adapter + dotenv + pg
npm install @prisma/client @prisma/adapter-pg dotenv pg

# Auth.js / NextAuth + Prisma adapter
npm install @auth/prisma-adapter next-auth@beta
```

---

## 2. Initialize Prisma

From your Next.js app root:

```bash
npx prisma init
```

This creates:

- `prisma/schema.prisma`
- `prisma.config.ts`
- `.env` with `DATABASE_URL`
- Prisma client output (adjust `output` to `../app/generated/prisma` like this repo)

Create a Postgres DB and replace `DATABASE_URL` in `.env` with your `postgres://...` connection string.

---

## 3. Prisma schema (Auth.js models)

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

Run migrations and generate client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 4. `prisma.config.ts` (dotenv + datasource)

```ts
// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

## 5. Prisma Client (`lib/prisma.ts` with PrismaPg adapter)

```ts
// lib/prisma.ts
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

---

## 6. Environment variables (Auth.js / GitHub)

```env
DATABASE_URL=<YOUR_DATABASE_URL>
AUTH_SECRET=<YOUR_AUTH_SECRET>
AUTH_GITHUB_ID=<YOUR_GITHUB_CLIENT_ID>
AUTH_GITHUB_SECRET=<YOUR_GITHUB_CLIENT_SECRET>
```

Generate `AUTH_SECRET` via:

```bash
npx auth secret --copy
```

Create a GitHub OAuth app with:

- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/callback/github`

Copy client ID/secret into `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.

---

## 7. Auth.js / NextAuth core (`auth.ts` + `lib/auth.ts`)

```ts
// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
});
```

```ts
// lib/auth.ts
"use server";

import { signIn, signOut } from "@/auth";

export const logIn = async () => {
  await signIn("github", { redirectTo: "/user" });
};

export const logOut = async () => {
  await signOut({ redirectTo: "/" });
};
```

---

## 8. Route handler (`app/api/auth/[...nextauth]/route.ts`)

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

---

## 9. Proxy / protected routes (`proxy.ts`)

```ts
// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/user"];

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}
```

---

## 10. Components (`app/components/SignInButton.tsx` and `app/components/SignOutButton.tsx`)

```tsx
// app/components/SignInButton.tsx
"use client";

import React from "react";
import { logIn } from "../../../lib/auth";

export default function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => logIn()}
      className="mt-8 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"
    >
      <span className="flex items-center justify-center gap-3">
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-base font-medium">Continue with GitHub</span>
      </span>
    </button>
  );
}
```

```tsx
// app/components/SignOutButton.tsx
"use client";

import React from "react";
import { logOut } from "../../../lib/auth";

export default function SignOutButton() {
  const handleLogout = async () => {
    await logOut();
  };

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
  );
}
```

---

## 11. Pages (`app/page.tsx` and `app/user/page.tsx`)

```tsx
// app/page.tsx
"use server";

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import SignInButton from "./components/SignInButton";
import SignOutButton from "./components/SignOutButton";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

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
                alt={user.name ?? "User avatar"}
                className="rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                {user.name?.?.toUpperCase() ?? "U"}
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-400">
                Signed in as{" "}
                <span className="text-zinc-200">
                  {user.name ?? "User"}
                </span>
              </p>
            </div>

            <SignOutButton />
          </div>
        </section>
      </main>
    );
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
          By signing in, you agree to our{" "}
          <Link
            href="/"
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/"
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
```

```tsx
// app/user/page.tsx
import Image from "next/image";
import { auth } from "@/auth";
import SignOutButton from "../components/SignOutButton";
import Link from "next/link";

export default async function User() {
  const session = await auth();
  const user = session?.user;

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
                alt={user.name ?? "User avatar"}
                className="rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                {user.name?.?.toUpperCase() ?? "U"}
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-400">
                Signed in as{" "}
                <span className="text-zinc-200">
                  {user.name ?? "User"}
                </span>
              </p>
            </div>

            <SignOutButton />
          </div>
        </section>
      </main>
    );
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
    );
  }
}
```

---

## 12. Scripts and running

```json
// package.json
"scripts": {
  "vercel-build": "prisma generate && next build",
  "postinstall": "prisma generate",
  "dev": "next dev"
}
```

Run dev:

```bash
npm run dev
# or bun run dev / pnpm run dev / yarn dev
```

Open:

```text
http://localhost:3000
```

Inspect data with Prisma Studio:

```bash
npx prisma studio
```

You should see `User`, `Session`, `Account`, and `VerificationToken` populated after signing in with GitHub.
