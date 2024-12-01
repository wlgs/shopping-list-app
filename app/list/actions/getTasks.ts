"use server";
import "server-only";
import { validateRequest } from "@/auth/validate-request";
import { db } from "@/db";
import { listsTable, tasksTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type TaskApi = Awaited<ReturnType<typeof dbGetTasksFromUser>>[0];
export type TaskListApi = Awaited<ReturnType<typeof dbGetTasksAndListsFromUser>>[0];

export default async function getTasks() {
    const { user } = await validateRequest();

    if (!user) {
        return {
            default: {
                title: "Primary",
                tasks: [],
            },
        };
    }
    const [lists, tasks] = await Promise.all([dbGetListsFromUser(user.id), dbGetTasksFromUser(user.id)]);

    const tasksByList: { [key: string]: { title: string; tasks: TaskApi[] } } = {
        default: {
            title: "Primary",
            tasks: [],
        },
    };

    lists.forEach((list) => {
        tasksByList[list.id] = {
            title: list.title,
            tasks: [],
        };
    });

    tasks.forEach((task) => {
        const listId = task.listId || "default";
        tasksByList[listId].tasks.push(task);
    });

    // sort within each list
    Object.values(tasksByList).forEach((taskList) => {
        taskList.tasks.sort((taskA, taskB) => taskA.createdAt.getTime() - taskB.createdAt.getTime());
    });

    return tasksByList;
}

async function dbGetTasksFromUser(userId: string) {
    return db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
}

async function dbGetTasksAndListsFromUser(userId: string) {
    return db
        .select()
        .from(tasksTable)
        .fullJoin(listsTable, eq(tasksTable.listId, listsTable.id))
        .where(eq(tasksTable.userId, userId));
}

async function dbGetListsFromUser(userId: string) {
    return db.select().from(listsTable).where(eq(listsTable.userId, userId));
}
