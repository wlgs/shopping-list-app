"use server";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/auth/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { loginFormSchema } from "../login/login-schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

type Credentials = z.infer<typeof loginFormSchema>;

export async function signup(credentials: Credentials) {
    const result = loginFormSchema.safeParse(credentials);
    if (!result.success) {
        return {
            error: "Invalid credentials",
        };
    }

    const username = result.data.login;
    const password = result.data.password;

    const passwordHash = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.username, username),
    });
    if (existingUser) {
        return {
            error: "Username already exists",
        };
    }

    await db.insert(userTable).values({
        id: userId,
        username: username,
        password_hash: passwordHash,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/list");
}
