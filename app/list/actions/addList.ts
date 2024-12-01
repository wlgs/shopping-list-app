"use server";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { listsTable, tasksTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

export default async function addList(title: string) {
    const { user } = await validateRequest();

    if (!user) {
        return { success: false, error: "User not validated" };
    }

    let err;
    await dbAddList({ title, userId: user.id }).catch((error) => {
        console.error("Error adding new list", error);
        err = error;
    });
    if (err) {
        return { success: false, error: "Error adding new list" };
    }
    revalidatePath("/list");
    return { success: true };
}

async function dbAddList({ title, userId }: { title: string; userId: string }) {
    return db.insert(listsTable).values({
        title,
        userId,
        createdAt: new Date(),
    });
}
