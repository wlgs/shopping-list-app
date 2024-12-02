import { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

const loginPageUI = (page: Page) => {
    return {
        signInText: page.getByTestId("signin-text"),
        loginInput: page.getByTestId("signin-form-login"),
        passwordInput: page.getByTestId("signin-form-password"),
        submitButton: page.getByTestId("signin-form-submit"),
    };
};

test.describe("Login page", () => {
    test("user can log in @stateless", async ({ page }) => {
        const loginPage = loginPageUI(page);

        await page.goto("/login");

        await loginPage.loginInput.fill("asd");
        await loginPage.passwordInput.fill("asd");
        await loginPage.submitButton.click();

        await expect(page).toHaveURL(/\/list/);
    });

    test("displays error for too long username @stateless", async ({ page }) => {
        const loginPage = loginPageUI(page);

        await page.goto("/login");

        await loginPage.loginInput.fill(
            "invaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduserinvaliduser"
        );
        await loginPage.passwordInput.fill("validpassword");
        await loginPage.submitButton.click();

        const errorMessage = page.getByText("String must contain at most 32 character(s)");
        await expect(errorMessage).toBeVisible();
    });

    test("displays error when providing invalid credentials @stateless", async ({ page }) => {
        const loginPage = loginPageUI(page);

        await page.goto("/login");

        await loginPage.loginInput.fill("wrong");
        await loginPage.passwordInput.fill("wrongpassword");
        await loginPage.submitButton.click();

        const errorMessage = page.getByText("Incorrect username or password");
        await expect(errorMessage).toBeVisible();
    });
});
