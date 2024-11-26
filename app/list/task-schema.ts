import { z } from "zod";

export const taskFormSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    amount: z.coerce.number().optional(),
    amountType: z.string().optional(),
    imgUrl: z.string().optional(),
    completedAt: z.boolean().optional().nullable(),
    dueDate: z.date().optional(),
});
