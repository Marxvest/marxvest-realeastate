"use server";

import { redirect } from "next/navigation";

import { clearSession, createSession, verifyPassword } from "@/lib/auth";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/account");

  const user = verifyPassword(email, password);

  if (!user) {
    redirect(`/account?error=Sign-in details not recognized.`);
  }

  await createSession(user);

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect(nextPath);
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}
