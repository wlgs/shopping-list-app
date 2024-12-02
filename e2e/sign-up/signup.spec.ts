import { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

const signUpPageUI = (page: Page) => {
    return {
        signUpText: page.getByTestId("signup-text"),
        loginInput: page.getByTestId("signup-form-login"),
        passwordInput: page.getByTestId("signup-form-password"),
        submitButton: page.getByTestId("signup-form-submit"),
        form: page.getByTestId("signup-form"),
    };
};

test.describe("Sign up page", () => {
    test("user can register @stateless", async ({ page }) => {
        const signUpPage = signUpPageUI(page);

        await page.goto("/sign-up");

        await expect(signUpPage.signUpText).toBeVisible();
        await expect(signUpPage.form).toBeVisible();

        const randomValidUsername = Math.random().toString(24);
        const randomValidPassword = Math.random().toString(24);

        await signUpPage.loginInput.fill(randomValidUsername);
        await signUpPage.passwordInput.fill(randomValidPassword);

        await signUpPage.submitButton.click();

        await expect(page).toHaveURL(/\/list/);
    });

    test("displays error for existing username @stateless", async ({ page }) => {
        const signUpPage = signUpPageUI(page);

        await page.goto("/sign-up");

        await signUpPage.loginInput.fill("asd");
        await signUpPage.passwordInput.fill("asd");
        await signUpPage.submitButton.click();

        const errorMessage = page.getByText("Username already exists");
        await expect(errorMessage).toBeVisible();
    });
});
