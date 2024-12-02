import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("signin-form-login").fill("playwright-user");
    await page.getByTestId("signin-form-password").fill("playwright-user");
    await page.getByTestId("signin-form-submit").click();

    await page.waitForURL("/list");
    await page.context().storageState({ path: authFile });
});
