import { makeTestTodoRepository } from "@/core/tests/helpers/make-test-todo-repository";
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
  // Erros
});
