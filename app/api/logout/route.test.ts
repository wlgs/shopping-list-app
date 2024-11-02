import { GET } from "./route";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

jest.mock("next/headers", () => ({
    cookies: jest.fn().mockReturnValue({
        delete: jest.fn(),
    }),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

describe("GET function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the auth_session cookie and redirect to home page", async () => {
        await GET();

        expect(cookies).toHaveBeenCalled();
        expect(cookies().delete).toHaveBeenCalledWith("auth_session");
        expect(redirect).toHaveBeenCalledWith("/");
    });
});
