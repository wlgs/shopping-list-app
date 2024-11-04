"use client";
import deleteTask from "./actions/deleteTask";

interface DeleteTaskButtonProps {
    taskId: string;
}

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
    return (
        <button
            onClick={async () => {
                if (confirm("Are you sure you want to delete this task?")) {
                    const res = await deleteTask(taskId);
                    if (res.success) {
                        alert("Task deleted");
                    } else {
                        alert(res.error);
                    }
                }
            }}
        >
            Delete
        </button>
    );
}
