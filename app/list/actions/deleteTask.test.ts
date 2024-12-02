import { validateRequest } from "@/auth/validate-request";
import deleteTask from "./deleteTask";
import { db } from "@/db";

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn(),
}));

jest.mock("@/db", () => ({
    db: {
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
    },
}));

jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

jest.mock("@/db/schema", () => ({
    tasksTable: "tasksTable",
}));

describe("Delete task server action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if user is not validated", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        const result = await deleteTask("task-id");
        expect(result).toEqual({ success: false, error: "User not validated" });
    });

    it("should return success when task is deleted", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValue({ success: true });

        const result = await deleteTask("task-id");
        expect(result).toEqual({ success: true });
    });

    it("should handle database error gracefully", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockRejectedValue("Database error");

        const result = await deleteTask("task-id");
        expect(result).toEqual({ success: false, error: "Error deleting task" });
    });
});
