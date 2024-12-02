"use client";
import { Button } from "@/components/ui/button";
import deleteTask from "./actions/deleteTask";
import { Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteTaskButtonProps {
    taskId: string;
}

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={null} className="px-0" data-testid="delete-task-button">
                    <Trash className="mx-2" size={16} aria-description="delete task" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you really want to delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            const res = await deleteTask(taskId);
                            if (res.success) {
                                toast.success("Task deleted");
                            } else {
                                toast.error(res.error);
                            }
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
