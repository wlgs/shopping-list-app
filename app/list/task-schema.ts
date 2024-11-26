import { z } from "zod";

export const taskFormSchema = z.object({
    id: z.string(),
    title: z.string(),
    amount: z.coerce.number(),
    amountType: z.string(),
    imgUrl: z.string().optional(),
    completedAt: z.boolean().optional().nullable(),
    dueDate: z.date(),
});
