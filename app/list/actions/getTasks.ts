"use server";
import "server-only";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// can it be here? What if I import it into client code?
export type TaskApi = Awaited<ReturnType<typeof dbGetTasksFromUser>>[0];

export default async function getTasks() {
    const { user } = await validateRequest();

    if (!user) {
        return [];
    }
    const tasks = dbGetTasksFromUser(user.id);

    return tasks;
}

async function dbGetTasksFromUser(userId: string) {
    return db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
}
