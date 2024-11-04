import { validateRequest } from "@/auth/validate-request";
import getTasks from "./actions/getTasks";
import { redirect } from "next/navigation";
import DeleteTaskButton from "./deleteTaskButton";
import { EditTaskButton } from "./editTaskButton";
import { cn } from "@/lib/utils";
import { DoneTaskButton } from "./doneTaskButton";

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
    return (
        <main className="container mx-auto">
            <ul className="flex flex-col gap-1">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={cn(
                            "  bg-secondary rounded-md flex flex-row gap-2 px-2 py-1 items-baseline",
                            task.completedAt && "line-through bg-green-400 opacity-80"
                        )}
                    >
                        <h2 className="font-bold text-xl">{task.title}</h2>
                        <p>
                            {task.amount} {task.amountType}
                        </p>
                        {task.imgUrl && <img src={task.imgUrl} alt={task.title} />}
                        <div className="ml-auto flex flex-row items-center">
                            <p className={cn(isInPast(task.dueDate) && !task.completedAt && "text-red-500")}>
                                {new Date(task.dueDate).toLocaleString()}
                            </p>
                            <DoneTaskButton taskId={task.id} completed={!!task.completedAt} />
                            <EditTaskButton />
                            <DeleteTaskButton taskId={task.id} />
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
