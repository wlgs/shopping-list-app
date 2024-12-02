"use client";
import { Trash } from "lucide-react";
import deleteList from "./actions/deleteList";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

interface DeleteListIdButtonProps {
    listId: string;
}

export default function DeleteListButton({ listId }: DeleteListIdButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={null} className="px-0" data-testid="delete-list-button">
                    <Trash className="mx-2" size={16} aria-description="delete task" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you really want to delete this list?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            const res = await deleteList(listId);
                            if (res.success) {
                                toast.success("List deleted");
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
