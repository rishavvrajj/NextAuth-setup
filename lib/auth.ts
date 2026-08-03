"use server";

import { signIn, signOut } from "@/auth";

export const credentialsLogIn = async (email: string, password: string) => {
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
};

export const googlelogIn = async () => {
    await signIn("google", {redirectTo: '/user'})
}

export const githublogIn = async () => {
    await signIn("github", {redirectTo: '/user'})
}

export const logOut = async () => {
    await signOut({redirectTo: '/'})
}