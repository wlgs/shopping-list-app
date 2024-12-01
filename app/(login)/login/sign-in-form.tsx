"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "./login-schema";
import { login } from "./signin-action";

export default function SignInForm() {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
    });

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        const response = await login(values).catch((error) => {
            form.setError("root", {
                type: "manual",
                message: error,
            });
        });
        if (response && response.error) {
            form.setError("root", {
                type: "manual",
                message: response.error,
            });
            return;
        }
        form.reset();
    }

    return (
        <>
            <p>Sign in</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="login"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Sign in</Button>
                    <p className="text-red-500">{form.formState.errors.root?.message}</p>
                </form>
            </Form>
        </>
    );
}
