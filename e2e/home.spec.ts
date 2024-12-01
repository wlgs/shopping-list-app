import { test, expect, Page } from "@playwright/test";

const navbarUI = (page: Page) => {
    return {
        register: page.getByRole("link", { name: "Register" }),
        login: page.getByRole("link", { name: "Login" }),
        home: page.getByRole("link", { name: "toBuy" }),
    };
};

test.describe("Home page", () => {
    test("has title @stateless", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Shopping app/);
    });
    test("navbar has working links @stateless", async ({ page }) => {
        const navbar = navbarUI(page);
        await page.goto("/");

        await navbar.home.click();
        await expect(page).toHaveURL(/\//);

        await navbar.login.click();
        await expect(page).toHaveURL(/\/login/);

        await navbar.register.click();
        await expect(page).toHaveURL(/\/sign-up/);
    });
});
