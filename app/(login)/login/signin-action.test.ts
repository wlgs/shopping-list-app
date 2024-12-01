import { login } from "./signin-action";
import { lucia } from "@/auth/auth";
import { db } from "@/db";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    },
}));
jest.mock("@node-rs/argon2", () => ({
    verify: jest.fn(),
}));
jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

describe("Login server action", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return an error for invalid username", async () => {
        const credentials = {
            login: "invaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduser",
            password: "validpassword",
        };

        const result = await login(credentials);

        expect(result).toEqual({ error: "Invalid credentials" });
    });

    it("should return an error for invalid password", async () => {
        const credentials = {
            login: "asd",
            password: "invalidpasswordforexistinguser",
        };

        (verify as jest.Mock).mockResolvedValue(false);

        const result = await login(credentials);

        expect(result).toEqual({ error: "Incorrect username or password" });
    });

    it("should return an error for non-existent user", async () => {
        const credentials = {
            login: "asd",
            password: "invalidpasswordforexistinguser",
        };

        (db.query.userTable.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await login(credentials);

        expect(result).toEqual({ error: "Incorrect username or password" });
    });

    it("should return an error for incorrect password", async () => {
        const credentials = {
            login: "asd",
            password: "invalidpasswordforexistinguser",
        };

        (db.query.userTable.findFirst as jest.Mock).mockResolvedValue({
            id: "123",
            username: "existinguser",
            password_hash: "hashedpassword",
        });
        (verify as jest.Mock).mockResolvedValue(false);

        const result = await login(credentials);

        expect(result).toEqual({ error: "Incorrect username or password" });
    });

    it("should successfully log in and redirect for valid credentials", async () => {
        const credentials = {
            login: "validUser",
            password: "validPassword",
        };

        (db.query.userTable.findFirst as jest.Mock).mockResolvedValue({
            id: "123",
            username: "validuser",
            password_hash: "hashedpassword",
        });
        (verify as jest.Mock).mockResolvedValue(true);
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

        await login(credentials);

        expect(lucia.createSession).toHaveBeenCalledWith("123", {});
        expect(lucia.createSessionCookie).toHaveBeenCalledWith("session123");
        expect(mockCookies.set).toHaveBeenCalledWith("session_cookie", "cookie_value", { httpOnly: true });
        expect(redirect).toHaveBeenCalledWith("/list");
    });
});
