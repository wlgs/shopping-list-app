"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function editTask(
    taskId: string,
    title: string,
    amount: number,
    amountType: string,
    imgUrl: string,
    dueDate: Date,
    completedAt: Date
) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: "User not validated" };
    }

    let err;
    await dbEditTask(taskId, title, amount, amountType, imgUrl, dueDate, completedAt, user.id).catch((error) => {
        console.error("Error editing task", error);
        err = error;
    });
    if (err) {
        return { success: false, error: "Error editing task" };
    }
    return { success: true };
}

async function dbEditTask(
    taskId: string,
    title: string,
    amount: number,
    amountType: string,
    imgUrl: string,
    dueDate: Date,
    completedAt: Date,
    userId: string
) {
    return db
        .update(tasksTable)
        .set({
            title,
            amount,
            amountType,
            imgUrl,
            dueDate,
            completedAt,
        })
        .where(and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId)));
}
