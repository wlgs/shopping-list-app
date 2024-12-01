"use client";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, Sheet } from "@/components/ui/sheet";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { taskFormSchema } from "./task-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import addTask from "./actions/addTask";
import { useState } from "react";
import { toast } from "sonner";

export default function AddNewTaskButton({ listId }: { listId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof taskFormSchema>>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            amount: 1,
            amountType: "g",
            dueDate: new Date(),
        },
    });

    async function onSubmit(values: z.infer<typeof taskFormSchema>) {
        const response = await addTask({
            title: values.title,
            amount: values.amount,
            listId: listId,
            amountType: values.amountType,
            imgUrl: values.imgUrl?.length ? values.imgUrl : null,
            dueDate: values.dueDate,
        }).catch((error) => {
            toast.error(`Error adding task ${error.message}`);
        });
        if (!response) {
            toast.error(`Error adding task`);
            return;
        }
        if (!response.success) {
            toast.error(`Error adding task ${response.error}`);
            return;
        }
        form.reset();
        setIsOpen(false);
        toast.success("Task added");
    }
    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="w-full">
                    <Input className="text-gray-500" placeholder="I need to buy..." />
                </SheetTrigger>
                <SheetContent side="bottom" className="min-h-[70vh]">
                    <SheetHeader>
                        <SheetTitle>Add an item</SheetTitle>
                    </SheetHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <input type="hidden" value="not-needed-fake-id" {...form.register("id")} />
                            {listId !== "default" && (
                                <input type="hidden" value={listId} {...form.register("listId")} />
                            )}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Item name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amountType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Amount type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="g">g</SelectItem>
                                                <SelectItem value="dg">dg</SelectItem>
                                                <SelectItem value="kg">kg</SelectItem>
                                                <SelectItem value="pieces">pieces</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imgUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image url</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.jpg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Due date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SheetFooter>
                                <Button type="submit">Add new item</Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    );
}
