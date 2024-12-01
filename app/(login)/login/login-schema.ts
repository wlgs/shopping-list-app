import { z } from "zod";

export const loginFormSchema = z.object({
    login: z.string().max(32),
    password: z.string(),
});
