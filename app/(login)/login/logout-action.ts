"use server";
import "server-only";
import { cookies } from "next/headers";

export async function logout() {
    cookies().delete("auth_session");
}
