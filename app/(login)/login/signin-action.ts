"use server";
import { lucia } from "@/auth/auth";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<ActionResult> {
    const username = formData.get("username");
    if (typeof username !== "string") {
        return {
            error: "Invalid username",
        };
    }
    const password = formData.get("password");
    if (typeof password !== "string") {
        return {
            error: "Invalid password",
        };
    }

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
    return redirect("/");
}

interface ActionResult {
    error: string;
}
