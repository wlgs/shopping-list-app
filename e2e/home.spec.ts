import { test, expect, Page } from "@playwright/test";

const navbarUI = (page: Page) => {
    return {
        register: page.getByRole("link", { name: "Register" }),
        login: page.getByRole("link", { name: "Sign in" }),
        logout: page.getByRole("button", { name: "Log out" }),
        home: page.getByRole("link", { name: "toBuy" }),
    };
};

test.describe("Home page unauthenticated", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("has title @stateless", async ({ page }) => {
        await page.goto("/login");
        await expect(page).toHaveTitle(/Shopping app/);
    });
    test("navbar has working links @stateless", async ({ page }) => {
        const navbar = navbarUI(page);
        await page.goto("/login");

        await navbar.login.click();
        await expect(page).toHaveURL(/\/login/);

        await navbar.register.click();
        await expect(page).toHaveURL(/\/sign-up/);
    });
});

test.describe("Home page authenticated", () => {
    test("has title @stateless", async ({ page }) => {
        await page.goto("/login");
        await expect(page).toHaveTitle(/Shopping app/);
    });
    test("navbar shows current user @stateless", async ({ page }) => {
        await page.goto("/login");

        await expect(page.getByText("playwright-user")).toBeVisible();
    });
    test("can log out @stateless", async ({ page }) => {
        const navbar = navbarUI(page);
        await page.goto("/login");

        await navbar.logout.click();

        await expect(page).toHaveURL(/\/login/);
    });
});
