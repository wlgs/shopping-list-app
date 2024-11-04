"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { tasksTable, userTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function deleteTask(taskId: string) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: "User not validated" };
    }

    let err;
    await dbDeleteTask(taskId, user.id).catch((error) => {
        console.error("Error deleting task", error);
        err = error;
    });
    if (err) {
        return { success: false, error: "Error deleting task" };
    }
    revalidatePath("/list");
    return { success: true };
}

async function dbDeleteTask(taskId: string, userId: string) {
    await db.delete(tasksTable).where(and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)));
}
