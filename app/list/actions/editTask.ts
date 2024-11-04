"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function editCompleteTask(taskId: string) {
    return editTask({ taskId, completedAt: new Date() });
}

export async function editUncompleteTask(taskId: string) {
    return editTask({ taskId, completedAt: null });
}

export default async function editTask({
    taskId,
    title,
    amount,
    amountType,
    imgUrl,
    dueDate,
    completedAt,
}: Omit<TaskEditData, "userId">) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: "User not validated" };
    }

    // todo: add validation

    let err;
    await dbEditTask({ taskId, title, amount, amountType, imgUrl, dueDate, completedAt, userId: user.id }).catch(
        (error) => {
            console.error("Error editing task", error);
            err = error;
        }
    );
    if (err) {
        return { success: false, error: "Error editing task" };
    }
    revalidatePath("/list");
    return { success: true };
}

interface TaskEditData {
    taskId: string;
    userId: string;
    title?: string;
    amount?: number;
    amountType?: string;
    imgUrl?: string;
    dueDate?: Date;
    completedAt?: Date | null;
}

async function dbEditTask({ taskId, userId, title, amount, amountType, imgUrl, dueDate, completedAt }: TaskEditData) {
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
