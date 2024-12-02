import { validateRequest } from "@/auth/validate-request";
import deleteList from "./deleteList";
import { db } from "@/db";

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn(),
}));

jest.mock("@/db", () => ({
    db: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    },
}));

jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

jest.mock("@/db/schema", () => ({
    listsTable: "listsTable",
    tasksTable: "tasksTable",
}));

describe("Delete list server action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if user is not validated", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        const result = await deleteList("list-id");
        expect(result).toEqual({ success: false, error: "User not validated" });
    });

    it("should return an error when trying to delete default list", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        const result = await deleteList("default");
        expect(result).toEqual({ success: false, error: "Cannot delete default list" });
    });

    it("should return an error if list has tasks", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValue([{ id: "task-1" }]);

        const result = await deleteList("list-id");
        expect(result).toEqual({ success: false, error: "List has tasks" });
    });

    it("should return success when list is deleted", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValueOnce([]);
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValueOnce({ success: true });

        const result = await deleteList("list-id");
        expect(result).toEqual({ success: true });
    });

    it("should handle database error when checking tasks", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockRejectedValue("Database error");

        const result = await deleteList("list-id");
        expect(result).toEqual({ success: false, error: "Error checking for tasks" });
    });

    it("should handle database error when deleting list", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValueOnce([]);
        // @ts-ignore
        (db.where as jest.Mock).mockRejectedValueOnce("Database error");

        const result = await deleteList("list-id");
        expect(result).toEqual({ success: false, error: "Error deleting list" });
    });
});
