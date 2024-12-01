"use client";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarIcon, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { taskFormSchema } from "./task-schema";
import { TaskApi } from "./actions/getTasks";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import editTask from "./actions/editTask";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditTaskButtonProps {
    task: TaskApi;
}

export function EditTaskButton({ task }: EditTaskButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<z.infer<typeof taskFormSchema>>({
        resolver: zodResolver(taskFormSchema),
    });

    useEffect(() => {
        form.reset({
            id: task.id,
            amount: task.amount,
            amountType: task.amountType,
            imgUrl: task.imgUrl ?? "",
            title: task.title,
            dueDate: task.dueDate,
        });
    }, [task]);

    async function onSubmit(values: z.infer<typeof taskFormSchema>) {
        const response = await editTask({
            taskId: task.id,
            title: values.title,
            amount: values.amount,
            amountType: values.amountType,
            imgUrl: values.imgUrl?.length ? values.imgUrl : null,
            dueDate: values.dueDate,
        }).catch((error) => {
            toast.error(`Error editing task ${error.message}`);
        });
        if (!response) {
            toast.error(`Error editing task`);
            return;
        }
        if (!response.success) {
            toast.error(`Error editing task ${response.error}`);
            return;
        }
        form.reset();
        toast.success("Task edited");
        setIsOpen(false);
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant={null}>
                        <Edit />
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="min-h-[70vh]">
                    <SheetHeader>
                        <SheetTitle>Edit an item</SheetTitle>
                    </SheetHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <input type="hidden" {...form.register("id")} />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="item" {...field} />
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
                                        <div className="flex gap-2 items-center flex-row">
                                            <FormControl>
                                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                            {field.value && (
                                                <img src={field.value} alt="preview" className="w-48 h-27" />
                                            )}
                                        </div>
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
                                <SheetClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>
        </>
    );
}
