"use client";
import { Button } from "@/components/ui/button";
import { Badge, BadgeCheck, Loader, Loader2 } from "lucide-react";
import { editCompleteTask, editUncompleteTask } from "./actions/editTask";
import { useTransition } from "react";

interface DoneTaskButtonProps {
    taskId: string;
    completed: boolean;
}

export function DoneTaskButton({ taskId, completed }: DoneTaskButtonProps) {
    const [isPending, startTransition] = useTransition();
    return (
        <>
            <Button
                onClick={() => {
                    startTransition(() => {
                        completed ? editUncompleteTask(taskId) : editCompleteTask(taskId);
                    });
                }}
                disabled={isPending}
                variant={null}
            >
                {isPending ? <Loader className="animate-spin" /> : completed ? <BadgeCheck /> : <Badge />}
            </Button>
        </>
    );
}
