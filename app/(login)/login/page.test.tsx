import { fireEvent, render, screen } from "@testing-library/react";
import Page from "./page";
import { login } from "./signin-action";

jest.mock("./signin-action", () => ({
    login: jest.fn().mockResolvedValue(undefined),
}));

describe("Login Page", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(async () => {
        render(await Page());
    });

    it("renders heading correctly", () => {
        expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    });

    it("renders username input", () => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it("renders password input", () => {
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("renders continue button", () => {
        expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    it("calls login function on form submit", () => {
        const form = screen.getByTestId("login-form") as HTMLFormElement;
        fireEvent.submit(form);
        expect(login).toHaveBeenCalled();
    });
});
