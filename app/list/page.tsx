import { validateRequest } from "@/auth/validate-request";
import getTasks from "./actions/getTasks";
import { redirect } from "next/navigation";
import DeleteTaskButton from "./deleteTaskButton";

export default async function Page() {
    const { user } = await validateRequest();
    if (!user) {
        redirect("/login");
    }
    const tasks = await getTasks();
    return (
        <>
            <h1>Your list</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <h2>{task.title}</h2>
                        <p>
                            {task.amount} {task.amountType}
                        </p>
                        <p>Due: {new Date(task.dueDate).toISOString()}</p>
                        {task.imgUrl && <img src={task.imgUrl} alt={task.title} />}
                        <DeleteTaskButton taskId={task.id} />
                    </li>
                ))}
            </ul>
        </>
    );
}
