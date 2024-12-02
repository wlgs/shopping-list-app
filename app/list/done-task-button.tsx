"use client";
import { Button } from "@/components/ui/button";
import { Badge, BadgeCheck, Loader, Loader2 } from "lucide-react";
import { editCompleteTask, editUncompleteTask } from "./actions/editTask";
import { useTransition } from "react";
import { toast } from "sonner";

interface DoneTaskButtonProps {
    taskId: string;
    completed: boolean;
}

export function DoneTaskButton({ taskId, completed }: DoneTaskButtonProps) {
    const [isPending, startTransition] = useTransition();
    return (
        <>
            <Button
                data-testid="complete-task-button"
                onClick={() => {
                    startTransition(() => {
                        completed ? editUncompleteTask(taskId) : editCompleteTask(taskId);
                        completed
                            ? toast.info("Task marked as uncompleted")
                            : toast.success("Task marked as completed");
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
