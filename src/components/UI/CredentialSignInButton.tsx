"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(30),
});

type FormData = z.infer<typeof schema>;

export default function CredentialSignInButton() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const submitData = async (data: FormData) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push("/user");
    } else {
      console.log(await response.json());
    }
  };

  return (
    <main className="">
      
    <div className="text-start space-y-3 py-5">
        <h1 className="text-3xl font-bold tracking-tight leading-none text-black">
            Welcome Back
        </h1>
        <p className="text-sm leading-none text-black">
            Sign in to continue to your account.
        </p>
    </div>

    <form onSubmit={handleSubmit(submitData)} className="space-y-1">

    <div className="space-y-2 text-zinc-900">
        
      <div className="flex flex-col">
        <label className="ml-0.5 text-sm">
          Email {errors.email && <span className="text-xs text-red-400">* {errors.email.message}</span>}
        </label>
        <input
          type="email"
          className="p-2 my-1 border border-zinc-600 w-full rounded-md hover:border-zinc-500 transition-all duration-300"
          placeholder=" email"
          {...register("email")}
        />
      </div>

      <div className="flex flex-col">
        <label className="ml-0.5 text-sm">
          Password {errors.password && <span className="text-xs text-red-400">* {errors.password.message}</span>}
        </label>
        <input
          type="password"
          className="p-2 my-1 border border-zinc-600 w-full rounded-md hover:border-zinc-500 transition-all duration-300"
          placeholder=" password"
          {...register("password")}
        />
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-2 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"
      >
        Login
      </button>

    </div>

    </form>
    </main>
  );
}