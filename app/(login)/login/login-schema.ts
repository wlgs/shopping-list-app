import { z } from "zod";

export const loginFormSchema = z.object({
    login: z.string(),
    password: z.string(),
});
