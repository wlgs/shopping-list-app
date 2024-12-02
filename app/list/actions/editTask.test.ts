import { validateRequest } from "@/auth/validate-request";
import editTask, { editCompleteTask, editUncompleteTask } from "./editTask";
import { db } from "@/db";

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn(),
}));

jest.mock("@/db", () => ({
    db: {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
    },
}));

jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

jest.mock("@/db/schema", () => ({
    tasksTable: "tasksTable",
}));

describe("Edit task server actions", () => {
    const mockTask = {
        taskId: "task-id",
        title: "Updated Task",
        amount: 2,
        amountType: "kg",
        dueDate: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if user is not validated", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        const result = await editTask(mockTask);
        expect(result).toEqual({ success: false, error: "User not validated" });
    });

    it("should return success when task is edited", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValue({ success: true });

        const result = await editTask(mockTask);
        expect(result).toEqual({ success: true });
    });

    it("should handle database error gracefully", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockRejectedValue("Database error");

        const result = await editTask(mockTask);
        expect(result).toEqual({ success: false, error: "Error editing task" });
    });

    it("should mark task as completed", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValue({ success: true });

        const result = await editCompleteTask("task-id");
        expect(result).toEqual({ success: true });
    });

    it("should mark task as uncompleted", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValue({ success: true });

        const result = await editUncompleteTask("task-id");
        expect(result).toEqual({ success: true });
    });
});
