"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetFooter,
    Sheet,
} from "@/components/ui/sheet";

export default function AddNewTaskButton() {
    return (
        <>
            <Sheet>
                <SheetTrigger className="w-full">
                    <Input className="text-gray-500" placeholder="I need to buy..." />
                </SheetTrigger>
                <SheetContent side="bottom" className="min-h-[70vh]">
                    <SheetHeader>
                        <SheetTitle>Add new item</SheetTitle>
                    </SheetHeader>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
