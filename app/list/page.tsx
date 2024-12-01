import { validateRequest } from "@/auth/validate-request";
import getTasks, { TaskApi } from "./actions/getTasks";
import { redirect } from "next/navigation";
import DeleteTaskButton from "./delete-task-button";
import { EditTaskButton } from "./edit-task-button";
import { cn } from "@/lib/utils";
import AddNewTaskButton from "./add-new-task-button";
import { DoneTaskButton } from "./done-task-button";
import AddNewListButton from "./add-new-list-button";
import DeleteListButton from "./delete-list-button";

function isInPast(date: Date) {
    let comparDate = date;
    if (date instanceof String) {
        comparDate = new Date(date);
    }
    const currentDate = new Date();
    if (currentDate.getTime() > comparDate.getTime()) {
        return true;
    }
    return false;
}

export default async function Page() {
    const { user } = await validateRequest();
    if (!user) {
        redirect("/login");
    }
    const tasks = await getTasks();
    const lists = Object.keys(tasks);
    return (
        <main className="container mx-auto lg:px-40 pb-80">
            {lists.map((listId) => {
                return (
                    <div key={listId} className="mb-8">
                        <div className="flex flex-row items-center">
                            <h2 className="text-2xl font-bold">{tasks[listId].title}</h2>
                            {listId != "default" && <DeleteListButton listId={listId} />}
                        </div>
                        <ul className="flex flex-col gap-1">
                            {tasks[listId].tasks.map((task: TaskApi) => (
                                <li
                                    key={task.id}
                                    className={cn(
                                        "  bg-secondary rounded-md flex flex-row gap-2 px-2 py-1 items-baseline",
                                        task.completedAt && "line-through bg-green-400 opacity-40"
                                    )}
                                >
                                    <DoneTaskButton taskId={task.id} completed={!!task.completedAt} />
                                    {task.imgUrl && (
                                        <img
                                            className="self-center"
                                            src={task.imgUrl}
                                            alt={task.title}
                                            width={50}
                                            height={50}
                                        />
                                    )}
                                    <h2 className="font-bold text-xl">{task.title}</h2>
                                    <p>
                                        {task.amount} {task.amountType}
                                    </p>
                                    <div className="ml-auto flex flex-row items-center">
                                        <p
                                            className={cn(
                                                isInPast(task.dueDate) && !task.completedAt && "text-red-500"
                                            )}
                                        >
                                            {new Date(task.dueDate).toLocaleString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <EditTaskButton task={task} />
                                        <DeleteTaskButton taskId={task.id} />
                                    </div>
                                </li>
                            ))}
                            <li>
                                <AddNewTaskButton listId={listId != "default" ? listId : undefined} />
                            </li>
                        </ul>
                    </div>
                );
            })}
            <AddNewListButton />
        </main>
    );
}
