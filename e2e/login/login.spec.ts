import { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";

const loginPageUI = (page: Page) => {
    return {
        signInText: page.getByTestId("signin-text"),
        loginInput: page.getByTestId("signin-form-login"),
        passwordInput: page.getByTestId("signin-form-password"),
        submitButton: page.getByTestId("signin-form-submit"),
    };
};

test("user can log in @stateless", async ({ page }) => {
    const loginPage = loginPageUI(page);

    await page.goto("/login");

    await loginPage.loginInput.fill("user");
    await loginPage.passwordInput.fill("user");
    await loginPage.submitButton.click();

    await expect(page).toHaveURL(/\/list/);
});
