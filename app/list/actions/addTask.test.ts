import { validateRequest } from "@/auth/validate-request";
import addTask from "./addTask";
import { db } from "@/db";

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn(),
}));

jest.mock("@/db", () => ({
    db: {
        insert: jest.fn().mockImplementation(() => ({
            values: jest.fn(),
        })),
    },
}));

jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

jest.mock("@/db/schema", () => ({
    tasksTable: "tasksTable",
}));

describe("Add task server action", () => {
    const mockTask = {
        title: "Test Task",
        amount: 1,
        amountType: "kg",
        dueDate: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if user is not validated", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        const result = await addTask(mockTask);

        expect(result).toEqual({ success: false, error: "User not validated" });
    });

    it("should return success if adding new task succeeds", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({
            user: { id: "user-id" },
            session: "session",
        });

        const result = await addTask(mockTask);

        expect(result).toEqual({ success: true });
    });

    it("should handle database error gracefully", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({
            user: { id: "user-id" },
            session: "session",
        });
        (db.insert as jest.Mock).mockImplementation(() => ({
            values: jest.fn().mockRejectedValue("Error adding new task"),
        }));

        const result = await addTask(mockTask);

        expect(result).toEqual({ success: false, error: "Error deleting task" });
    });
});
