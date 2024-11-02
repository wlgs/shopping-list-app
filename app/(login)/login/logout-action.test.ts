import { logout } from "./logout-action";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
    cookies: jest.fn().mockReturnValue({
        delete: jest.fn(),
    }),
}));

describe("logout function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the auth_session cookie", async () => {
        await logout();

        expect(cookies).toHaveBeenCalled();
        expect(cookies().delete).toHaveBeenCalledWith("auth_session");
    });
});
