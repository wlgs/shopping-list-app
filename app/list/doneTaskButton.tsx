"use client";
import { Button } from "@/components/ui/button";
import { Badge, BadgeCheck } from "lucide-react";
import { editCompleteTask, editUncompleteTask } from "./actions/editTask";

interface DoneTaskButtonProps {
    taskId: string;
    completed: boolean;
}

export function DoneTaskButton({ taskId, completed }: DoneTaskButtonProps) {
    return (
        <>
            <Button
                onClick={() => {
                    completed ? editUncompleteTask(taskId) : editCompleteTask(taskId);
                }}
                variant="ghost"
            >
                {completed ? <BadgeCheck /> : <Badge />}
            </Button>
        </>
    );
}
