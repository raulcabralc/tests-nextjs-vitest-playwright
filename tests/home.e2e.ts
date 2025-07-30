import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/tests/helpers/make-test-todo-repository";
import { test, expect, Page } from "@playwright/test";

const homeUrl = "/";
const heading = "Lista de tarefas";
const input = "Tarefa";
const button = "Criar tarefa";
const buttonBusy = "Criando tarefa";
const newTodoText = "New todo";
const titleHtml = "Testes com Vitest e Playwright";

const getHeading = (p: Page) => p.getByRole("heading", { name: heading });
const getInput = (p: Page) => p.getByRole("textbox", { name: input });
const getInputBusy = (p: Page) =>
  p.getByRole("textbox", { name: input, disabled: true });
const getBtn = (p: Page) => p.getByRole("button", { name: button });
const getBtnBusy = (p: Page) =>
  p.getByRole("button", { name: buttonBusy, disabled: true });

const getAll = (p: Page) => {
  return {
    heading: getHeading(p),
    input: getInput(p),
    inputBusy: getInputBusy(p),
    btn: getBtn(p),
    btnBusy: getBtnBusy(p),
  };
};

test.beforeEach(async ({ page }) => {
  const { deleteTodoNoWhere } = makeTestTodoRepository();
  await deleteTodoNoWhere();

  await page.goto(homeUrl);
});

test.afterAll(async () => {
  const { deleteTodoNoWhere } = makeTestTodoRepository();
  await deleteTodoNoWhere();
});

test.describe("<Home /> (E2E)", () => {
  // Renderização

  test.describe("Render", () => {
    test("should have correct html title", async ({ page }) => {
      await expect(page).toHaveTitle(titleHtml);
    });

    test("should render header, input and button to create Todos", async ({
      page,
    }) => {
      await expect(getHeading(page)).toBeVisible();
      await expect(getInput(page)).toBeVisible();
      await expect(getBtn(page)).toBeVisible();
    });
  });

  // Criação

  test.describe("Creation", () => {
    test("should allow the creation of a Todo", async ({ page }) => {
      const { btn, input } = getAll(page);

      await input.fill(newTodoText);
      await btn.click();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: newTodoText });
      await expect(createdTodo).toBeVisible();
    });

    test("should make the task trim from input when creating Todo", async ({
      page,
    }) => {
      const { btn, input } = getAll(page);

      const rawText = "  no spaces here  ";
      const trimmedText = rawText.trim();

      await input.fill(rawText);
      await btn.click();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: trimmedText });

      const createdTodoText = await createdTodo.textContent();

      expect(createdTodoText).toBe(trimmedText);
    });

    test("should allow the user to create more than one Todo", async ({
      page,
    }) => {
      const { btn, input } = getAll(page);

      const todoOne = "todoOne";
      const todoTwo = "todoTwo";

      await input.fill(todoOne);
      await btn.click();

      const todoOneItem = page
        .getByRole("listitem")
        .filter({ hasText: todoOne });

      await input.fill(todoTwo);
      await btn.click();

      const todoTwoItem = page
        .getByRole("listitem")
        .filter({ hasText: todoTwo });

      expect(todoOneItem).toBeVisible();
      expect(todoTwoItem).toBeVisible();
    });

    test("should deactivate button when creating Todo", async ({ page }) => {
      const { input, btn } = getAll(page);

      await input.fill(newTodoText);
      await btn.click();

      await expect(getBtnBusy(page)).toBeDisabled();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: newTodoText });

      await expect(createdTodo).toBeVisible();
      await expect(btn).toBeEnabled();
    });

    test("should deactivate input when creating Todo", async ({ page }) => {
      const { input, btn } = getAll(page);

      await input.fill(newTodoText);
      await btn.click();

      await expect(getInputBusy(page)).toBeDisabled();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: newTodoText });

      await expect(createdTodo).toBeVisible();
      await expect(input).toBeEnabled();
    });

    test("should clear input after the creation of a Todo", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill(newTodoText);
      await btn.click();

      const createdTodo = page
        .getByRole("listitem")
        .filter({ hasText: newTodoText });

      await expect(createdTodo).toBeVisible();
      await expect(input).toHaveText("");
    });
  });

  // Exclusão

  test.describe("Delete", () => {
    test("should allow a Todo to be deleted", async ({ page }) => {
      const todos = await insertTestTodos();
      await page.reload();

      const item = page
        .getByRole("listitem")
        .filter({ hasText: todos[0].task });

      await expect(item).toBeVisible();

      const deleteBtn = item.getByRole("button");
      await deleteBtn.click();

      await item.waitFor({ state: "detached" });
      await expect(item).not.toBeVisible();
    });

    test("should allow all Todos to be deleted", async ({ page }) => {
      const todos = await insertTestTodos();
      await page.reload();

      for (const todo of todos) {
        const item = page.getByRole("listitem").filter({ hasText: todo.task });
        const deleteBtn = item.getByRole("button");

        await expect(item).toBeVisible();

        await deleteBtn.click();

        await item.waitFor({ state: "detached" });
        await expect(item).not.toBeVisible();
      }
    });

    test("should deactivate list items while sending action", async ({
      page,
    }) => {
      await insertTestTodos();
      await page.reload();

      const item = page.getByRole("listitem").first();
      const itemText = await item.textContent();

      if (!itemText) {
        throw new Error("item text is empty");
      }

      const deleteBtn = item.getByRole("button");
      await deleteBtn.click();

      const allDeleteBtn = await page
        .getByRole("button", { name: /^apagar/i })
        .all();

      for (const btn of allDeleteBtn) {
        await expect(btn).toBeDisabled();
      }
    });
  });

  // Erros

  test.describe("Errors", () => {
    test("should show error if task has 3 or less characters", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill("abc");
      await btn.click();

      const errorText = "description should have more than 3 characters";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached" });
    });

    test("should show error if task name is already registered", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill("abcd");
      await btn.click();

      await input.fill("abcd");
      await btn.click();

      const errorText = "todo already exists with this name or ID";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached" });
      await expect(error).toBeVisible();
    });

    test("should remove error from screen when user fixes it", async ({
      page,
    }) => {
      const { input, btn } = getAll(page);

      await input.fill("abcd");
      await btn.click();

      await input.fill("abcd");
      await btn.click();

      const errorText = "todo already exists with this name or ID";
      const error = page.getByText(errorText);

      await error.waitFor({ state: "attached" });
      await expect(error).toBeVisible();

      await input.fill("abcde diff");
      await btn.click();

      await expect(error).not.toBeVisible();
    });
  });
});
