import { validateRequest } from "@/auth/validate-request";
import { addList } from "./addList";
import { db } from "@/db";

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn(),
}));

jest.mock("./addList", () => ({
    ...jest.requireActual("./addList"),
    dbAddList: jest.fn(),
}));

jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}));

jest.mock("@/db", () => ({
    db: {
        insert: jest.fn().mockImplementation(() => ({
            values: jest.fn(),
        })),
    },
}));

jest.mock("@/db/schema", () => ({
    listsTable: "listsTable",
}));

describe("Add list server action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error if user is not validated", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        const result = await addList("title");

        expect(result).toEqual({ success: false, error: "User not validated" });
    });

    it("should return success if adding new list succeeds", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: "user", session: "session" });
        const result = await addList("title");

        expect(result).toEqual({ success: true });
    });
    it("should handle database error gracefully", async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: "user", session: "session" });
        (db.insert as jest.Mock).mockImplementation(() => ({
            values: jest.fn().mockRejectedValue("Error adding new list"),
        }));

        const result = await addList("title");

        expect(result).toEqual({ success: false, error: "Error adding new list" });
    });
});
