import { signup } from "./signup-action";
import { lucia } from "@/auth/auth";
import { db } from "@/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";

jest.mock("@/db/schema", () => ({
    userTable: {
        findFirst: jest.fn(),
    },
}));
jest.mock("@/auth/auth", () => ({
    lucia: {
        createSession: jest.fn(),
        createSessionCookie: jest.fn(),
    },
}));
jest.mock("@/db", () => ({
    db: {
        query: {
            userTable: {
                findFirst: jest.fn(),
            },
        },
        insert: jest.fn().mockReturnValue({ values: jest.fn() }),
    },
}));
jest.mock("@node-rs/argon2", () => ({
    hash: jest.fn(),
}));
jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));
jest.mock("lucia", () => ({
    generateIdFromEntropySize: jest.fn(),
}));

describe("Signup server action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error for invalid username", async () => {
        const credentials = {
            login: "invaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduser",
            password: "validpassword",
        };

        const result = await signup(credentials);

        expect(result).toEqual({ error: "Invalid credentials" });
    });

    it("should return an error for existing username", async () => {
        const credentials = {
            login: "existinguser",
            password: "password123",
        };

        (db.query.userTable.findFirst as jest.Mock).mockResolvedValue({
            id: "123",
            username: "existinguser",
            password_hash: "hashedpassword",
        });

        const result = await signup(credentials);

        expect(result).toEqual({ error: "Username already exists" });
    });

    it("should successfully create account and redirect for valid credentials", async () => {
        const credentials = {
            login: "newuser",
            password: "validPassword",
        };

        (db.query.userTable.findFirst as jest.Mock).mockResolvedValue(null);
        (hash as jest.Mock).mockResolvedValue("hashedpassword");
        (generateIdFromEntropySize as jest.Mock).mockReturnValue("generated123");
        (lucia.createSession as jest.Mock).mockResolvedValue({ id: "session123" });
        (lucia.createSessionCookie as jest.Mock).mockReturnValue({
            name: "session_cookie",
            value: "cookie_value",
            attributes: { httpOnly: true },
        });
        const mockCookies = {
            set: jest.fn(),
        };
        (cookies as jest.Mock).mockReturnValue(mockCookies);

        await signup(credentials);

        expect(db.insert).toHaveBeenCalled();
        expect(lucia.createSession).toHaveBeenCalledWith("generated123", {});
        expect(lucia.createSessionCookie).toHaveBeenCalledWith("session123");
        expect(mockCookies.set).toHaveBeenCalledWith("session_cookie", "cookie_value", { httpOnly: true });
        expect(redirect).toHaveBeenCalledWith("/list");
    });
});
