"use client";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, Sheet } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { listFormSchema } from "./task-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { addList } from "./actions/addList";
import { toast } from "sonner";

export default function AddNewListButton() {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof listFormSchema>>({
        resolver: zodResolver(listFormSchema),
        defaultValues: {
            title: "My list",
        },
    });

    async function onSubmit(values: z.infer<typeof listFormSchema>) {
        const response = await addList(values.title).catch((error) => {
            toast.error(`Error adding new list ${error}`);
        });
        if (response && !response.success) {
            toast.error(`Error adding new list ${response.error}`);
            return;
        }
        form.reset();
        setIsOpen(false);
        toast.success("List added");
    }
    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="w-full" asChild>
                    <Button variant="outline" className="w-full">
                        Add new list
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="min-h-[70vh]">
                    <SheetHeader>
                        <SheetTitle>Add new list</SheetTitle>
                    </SheetHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>List title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My list" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SheetFooter>
                                <Button type="submit">Add new list</Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    );
}
