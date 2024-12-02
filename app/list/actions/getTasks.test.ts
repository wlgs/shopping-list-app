import { validateRequest } from "@/auth/validate-request";
import getTasks from "./getTasks";
import { db } from "@/db";

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn(),
}));

jest.mock("@/db", () => ({
    db: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
    },
}));

jest.mock("@/db/schema", () => ({
    tasksTable: "tasksTable",
    listsTable: "listsTable",
}));

describe("Get tasks server action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return empty default list if user is not validated", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        const result = await getTasks();
        expect(result).toEqual({
            default: {
                title: "Primary",
                tasks: [],
            },
        });
    });

    it("should return tasks grouped by lists", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });

        const mockLists = [{ id: "list-1", title: "List 1" }];

        const mockTasks = [
            {
                id: "task-1",
                listId: "list-1",
                createdAt: new Date("2024-01-01"),
            },
            {
                id: "task-2",
                listId: null,
                createdAt: new Date("2024-01-02"),
            },
        ];

        // @ts-ignore
        (db.where as jest.Mock).mockResolvedValueOnce(mockLists).mockResolvedValueOnce(mockTasks);

        const result = await getTasks();

        expect(result).toEqual({
            default: {
                title: "Primary",
                tasks: [mockTasks[1]],
            },
            "list-1": {
                title: "List 1",
                tasks: [mockTasks[0]],
            },
        });
    });

    it("should sort tasks by creation date within lists", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });

        const mockTasks = [
            {
                id: "task-1",
                listId: "list-1",
                createdAt: new Date("2024-01-02"),
            },
            {
                id: "task-2",
                listId: "list-1",
                createdAt: new Date("2024-01-01"),
            },
        ];

        // @ts-ignore
        (db.where as jest.Mock)
            .mockResolvedValueOnce([{ id: "list-1", title: "List 1" }])
            .mockResolvedValueOnce(mockTasks);

        const result = await getTasks();

        expect(result["list-1"].tasks[0].id).toBe("task-2");
        expect(result["list-1"].tasks[1].id).toBe("task-1");
    });

    it("should handle database errors gracefully", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: { id: "user-id" } });
        // @ts-ignore
        (db.where as jest.Mock).mockRejectedValue("Database error");

        await expect(getTasks()).rejects.toEqual("Database error");
    });
});
