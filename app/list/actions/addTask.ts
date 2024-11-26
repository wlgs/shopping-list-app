"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { tasksTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

interface TaskAddData {
    title: string;
    amount: number;
    amountType: string;
    imgUrl?: string | null;
    dueDate: Date;
}

export default async function addTask(task: TaskAddData) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: "User not validated" };
    }

    let err;
    await dbAddTask({ task, userId: user.id }).catch((error) => {
        console.error("Error deleting task", error);
        err = error;
    });
    if (err) {
        return { success: false, error: "Error deleting task" };
    }
    revalidatePath("/list");
    return { success: true };
}

async function dbAddTask({ task, userId }: { task: TaskAddData; userId: string }) {
    return db.insert(tasksTable).values({
        ...task,
        userId,
        createdAt: new Date(),
    });
}
