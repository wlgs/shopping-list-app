import { act, fireEvent, render, screen } from "@testing-library/react";
import Page from "./page";
import { validateRequest } from "@/auth/validate-request";
import { redirect } from "next/navigation";
import { signup } from "./signup-action";

jest.mock("next/navigation");

jest.mock("./signup-action", () => ({
    signup: jest.fn().mockResolvedValue({ error: "invalid" }),
}));

jest.mock("@/auth/validate-request", () => ({
    validateRequest: jest.fn().mockResolvedValue({ user: null }),
}));

describe("Register page unauthenticated", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: null });
        render(await Page());
    });

    it("renders form correctly", () => {
        expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    });

    it("renders sign up text", () => {
        expect(screen.getByTestId("signup-text")).toBeInTheDocument();
    });

    it("renders login input ", () => {
        expect(screen.getByTestId("signup-form-login")).toBeInTheDocument();
    });
    it("renders password input ", () => {
        expect(screen.getByTestId("signup-form-password")).toBeInTheDocument();
    });
    it("renders submit button", () => {
        expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
    });
    it("calls signup function on submit", async () => {
        const username = "username";
        const password = "password";
        const loginInput = screen.getByTestId("signup-form-login") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-form-password") as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: /register/i });
        const form = screen.getByTestId("signup-form");

        act(() => {
            fireEvent.change(loginInput, { target: { value: username } });
            fireEvent.change(passwordInput, { target: { value: password } });
            fireEvent.click(submitButton);
        });

        expect(form).toHaveFormValues({
            login: username,
            password,
        });
    });
});

describe("Login Page authenticated", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(async () => {
        (validateRequest as jest.Mock).mockResolvedValue({ user: "user", session: "ijasdfoijasdf" });
        render(await Page());
    });

    it("redirects to /list", () => {
        expect(redirect).toHaveBeenCalledWith("/list");
    });
});
