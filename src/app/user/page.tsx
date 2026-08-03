import Image from "next/image";
import { auth } from "@/auth";
import SignOutButton from "@/components/UI/SignOutButton";
import Link from "next/link";

export default async function UserPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center gap-4">
          {user?.image ? (
            <Image
              src={user.image}
              width={72}
              height={72}
              alt={user.name ?? "User avatar"}
              className="rounded-full border border-zinc-200 object-cover"
            />
          ) : (
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-700">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500">
              Signed in as{" "}
              <span className="text-zinc-700">{user?.name ?? "User"}</span>
            </p>
          </div>

          <SignOutButton />
        </div>
      </section>
    </main>
  );
}