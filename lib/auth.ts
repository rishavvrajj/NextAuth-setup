"use server";

import { signIn, signOut } from "@/auth";

export const githublogIn = async () => {
    await signIn("github", {redirectTo: '/user'})
}

export const googlelogIn = async () => {
    await signIn("google", {redirectTo: '/user'})
}

export const logOut = async () => {
    await signOut({redirectTo: '/'})
}