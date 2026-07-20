"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  findUserByEmail,
  verifyPassword,
  logActivity,
} from "@/lib/auth";

export type AuthState = { error?: string };

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Wrong email or password." };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  await logActivity(user.id, "login");
  redirect(user.role === "admin" ? "/admin" : "/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
