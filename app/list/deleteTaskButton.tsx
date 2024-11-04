"use client";
import { Button } from "@/components/ui/button";
import deleteTask from "./actions/deleteTask";
import { Trash } from "lucide-react";

interface DeleteTaskButtonProps {
    taskId: string;
}

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
    return (
        <Button
            variant="ghost"
            className=""
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
            <Trash size={48} />
        </Button>
    );
}
