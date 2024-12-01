"use server";
import { lucia } from "@/auth/auth";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginFormSchema } from "./login-schema";
import { z } from "zod";

type Credentials = z.infer<typeof loginFormSchema>;

export async function login(credentials: Credentials) {
    const result = loginFormSchema.safeParse(credentials);
    if (!result.success) {
        return {
            error: "Invalid credentials",
        };
    }

    const username = result.data.login;
    const password = result.data.password;

    const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.username, username),
    });
    if (!existingUser) {
        return {
            error: "Incorrect username or password",
        };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    if (!validPassword) {
        return {
            error: "Incorrect username or password",
        };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/list");
}
