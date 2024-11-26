import { validateRequest } from "@/auth/validate-request";
import getTasks from "./actions/getTasks";
import { redirect } from "next/navigation";
import DeleteTaskButton from "./delete-task-button";
import { EditTaskButton } from "./edit-task-button";
import { cn } from "@/lib/utils";
import AddNewTaskButton from "./add-new-task-button";
import { DoneTaskButton } from "./done-task-button";

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
    const tasks = (await getTasks()).sort((taskA, taskB) => taskA.createdAt.getTime() - taskB.createdAt.getTime());
    return (
        <main className="container mx-auto lg:px-40">
            <ul className="flex flex-col gap-1">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={cn(
                            "  bg-secondary rounded-md flex flex-row gap-2 px-2 py-1 items-baseline",
                            task.completedAt && "line-through bg-green-400 opacity-40"
                        )}
                    >
                        <DoneTaskButton taskId={task.id} completed={!!task.completedAt} />
                        <h2 className="font-bold text-xl">{task.title}</h2>
                        <p>
                            {task.amount} {task.amountType}
                        </p>
                        {task.imgUrl && <img src={task.imgUrl} alt={task.title} />}
                        <div className="ml-auto flex flex-row items-center">
                            <p className={cn(isInPast(task.dueDate) && !task.completedAt && "text-red-500")}>
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
                    <AddNewTaskButton />
                </li>
            </ul>
        </main>
    );
}
