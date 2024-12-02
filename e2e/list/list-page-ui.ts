import { Page } from "@playwright/test";

export const listPageUI = (page: Page) => {
    return {
        addTaskButton: page.getByPlaceholder("I need to buy..."),
        addListButton: page.getByRole("button", { name: "Add new list" }),
        newListInput: page.getByPlaceholder("My list"),
        newListInputSubmit: page.getByRole("button", { name: "Add new list" }),
        deleteListButton: page.getByTestId("delete-list-button"),
        deleteTaskButton: page.getByTestId("delete-task-button"),
        editTaskButton: page.getByTestId("edit-task-button"),
        completeTaskButton: page.getByTestId("complete-task-button"),
        deleteConfirmationButton: page.getByRole("button", { name: "Continue" }),
        taskDialog: {
            itemName: page.getByTestId("title-input"),
            amount: page.getByTestId("amount-input"),
            amountType: page.getByLabel("Amount type"),
            piecesOption: page.getByLabel("pieces"),
            imageUrl: page.getByTestId("image-input"),
            dueDate: page.getByLabel("Due date"),
            dueDateDay: page.getByRole("gridcell", { name: "18" }),
            submitButton: page.getByTestId("submit-task-data"),
        },
        list: page.getByTestId("list"),
    };
};
