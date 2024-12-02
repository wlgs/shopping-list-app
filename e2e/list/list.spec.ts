import { test, expect } from "@playwright/test";
import { listPageUI } from "./list-page-ui";

test.describe("List page", () => {
    test.describe.configure({ mode: "serial" });
    test("user can add and delete list @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addListButton.click();

        await listPage.newListInput.fill("List number2");

        await listPage.newListInputSubmit.click();

        await expect(page.getByText("List number2")).toBeVisible();

        await listPage.deleteListButton.click();
        await listPage.deleteConfirmationButton.click();
        await expect(page.getByText("List number2")).not.toBeVisible();
    });
    test("user can add tasks to a primary list @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addTaskButton.click();

        await listPage.taskDialog.itemName.fill("Mleko");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.dueDate.click();
        await listPage.taskDialog.dueDateDay.click();
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("Mleko")).toBeVisible();
    });

    test("user can add tasks to a secondary list @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addListButton.click();

        await listPage.newListInput.fill("List number3");

        await listPage.newListInputSubmit.click();

        await listPage.addTaskButton.nth(1).click();

        await listPage.taskDialog.itemName.fill("ItemNumber3");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.dueDate.click();
        await listPage.taskDialog.dueDateDay.click();
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("ItemNumber3")).toBeVisible();
    });

    test("user can delete tasks @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addTaskButton.nth(0).click();

        await listPage.taskDialog.itemName.fill("itemDeletionCase233");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.dueDate.click();
        await listPage.taskDialog.dueDateDay.click();
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("itemDeletionCase233")).toBeVisible();

        await page.getByText("itemDeletionCase2333").getByTestId("delete-task-button").click();
        await listPage.deleteConfirmationButton.click();

        await expect(page.getByText("Task deleted")).toBeVisible();
    });
    test("user can edit tasks @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addTaskButton.nth(0).click();

        await listPage.taskDialog.itemName.fill("ItemToEdit");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.dueDate.click();
        await listPage.taskDialog.dueDateDay.click();
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("ItemToEdit")).toBeVisible();

        await listPage.editTaskButton.nth(0).click();

        await listPage.taskDialog.itemName.fill("EditedItem");
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("EditedItem")).toBeVisible();
    });

    test("user can complete tasks @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addTaskButton.nth(0).click();

        await listPage.taskDialog.itemName.fill("ItemToCompleteCase111");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.dueDate.click();
        await listPage.taskDialog.dueDateDay.click();
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("ItemToCompleteCase111")).toBeVisible();

        await page.getByText("ItemToCompleteCase1113").getByTestId("complete-task-button").click();
        await expect(page.getByText("Task marked as completed")).toBeVisible();
    });

    test("user can uncomplete tasks @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addTaskButton.nth(0).click();

        await listPage.taskDialog.itemName.fill("ItemToUncomplete");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.dueDate.click();
        await listPage.taskDialog.dueDateDay.click();
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("ItemToUncomplete")).toBeVisible();

        await page.getByText("ItemToUncomplete3").getByTestId("complete-task-button").click();

        await expect(page.getByText("Task marked as completed")).toBeVisible();

        await page.getByText("ItemToUncomplete3").getByTestId("complete-task-button").click();

        await expect(page.getByText("Task marked as uncompleted")).toBeVisible();
    });

    test("user cannot delete list when it has tasks @stateful", async ({ page }) => {
        const listPage = listPageUI(page);
        await page.goto("/list");

        await listPage.addListButton.click();

        await listPage.newListInput.fill("List to be deleted");

        await listPage.newListInputSubmit.click();

        await expect(page.getByText("List to be deleted")).toBeVisible();

        await listPage.addTaskButton.last().click();

        await listPage.taskDialog.itemName.fill("ItemToDelete");
        await listPage.taskDialog.amount.fill("3");
        await listPage.taskDialog.amountType.click();
        await listPage.taskDialog.piecesOption.click();
        await listPage.taskDialog.imageUrl.fill("");
        await listPage.taskDialog.submitButton.click();

        await expect(page.getByText("ItemToDelete")).toBeVisible();

        await listPage.deleteListButton.last().click();
        await listPage.deleteConfirmationButton.click();

        await expect(page.getByText("List has tasks")).toBeVisible();
    });
});
