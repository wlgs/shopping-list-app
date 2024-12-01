"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { listsTable, tasksTable, userTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function deleteList(listId: string) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: "User not validated" };
    }

    let err;

    if (listId === "default") {
        return { success: false, error: "Cannot delete default list" };
    }

    const hasTasks = await dbListHasTasks(listId).catch((error) => {
        console.error("Error checking for tasks", error);
        err = error;
    });

    if (err) {
        return { success: false, error: "Error checking for tasks" };
    }

    console.log("hasTasks", hasTasks);
    if (hasTasks && hasTasks.length > 0) {
        return { success: false, error: "List has tasks" };
    }

    await dbDeleteList(listId, user.id).catch((error) => {
        console.error("Error deleting list", error);
        err = error;
    });
    if (err) {
        return { success: false, error: "Error deleting list" };
    }
    revalidatePath("/list");
    return { success: true };
}

async function dbDeleteList(listId: string, userId: string) {
    return db.delete(listsTable).where(and(eq(listsTable.userId, userId), eq(listsTable.id, listId)));
}

async function dbListHasTasks(listId: string) {
    return db.select().from(tasksTable).where(eq(tasksTable.listId, listId));
}
