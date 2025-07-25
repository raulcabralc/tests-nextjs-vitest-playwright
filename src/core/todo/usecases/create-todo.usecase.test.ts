import { makeTestTodoRepository } from "@/core/tests/helpers/make-test-todo-repository";
import { createTodoUseCase } from "./create-todo.usecase";
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract";

describe("createTodoUseCase (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();

    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();

    await deleteTodoNoWhere();
  });

  test("should return error if validation fails", async () => {
    const result = (await createTodoUseCase("")) as InvalidTodo;

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  test("should return todo if validation is ok", async () => {
    const task = "valid task";

    const result = (await createTodoUseCase(task)) as ValidTodo;

    expect(result.success).toBe(true);
    expect(result.todo).toStrictEqual({
      createdAt: expect.any(String),
      id: expect.any(String),
      task: "valid task",
    });
  });

  test("should return error if task already exists", async () => {
    const task = "task name won't work twice";

    await createTodoUseCase(task);
    const result = (await createTodoUseCase(task)) as InvalidTodo;

    expect(result).toStrictEqual({
      success: false,
      errors: ["todo already exists with this name or ID"],
    });
  });
});
