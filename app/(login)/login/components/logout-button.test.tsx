import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "./logout-button";
import { logout } from "../logout-action";
jest.mock("../logout-action");

describe("LogoutButton", () => {
    it("renders logout button", () => {
        render(<LogoutButton />);

        const button = screen.getByRole("button", { name: /log out/i });
        expect(button).toBeInTheDocument();
    });

    it("calls logout function on button click", () => {
        render(<LogoutButton />);

        const button = screen.getByRole("button", { name: /log out/i });
        fireEvent.click(button);
        expect(logout).toHaveBeenCalled();
    });
});
