"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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
