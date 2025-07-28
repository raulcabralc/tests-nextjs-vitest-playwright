import { makeTestTodoRepository } from "@/core/tests/helpers/make-test-todo-repository";
import { deleteTodoUseCase } from "./delete-todo.usecase";

describe("deleteTodoUseCase (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();
    await deleteTodoNoWhere();
  });

  test("should catch an invalid id and return errors", async () => {
    const result = await deleteTodoUseCase("");
    const failedResult = {
      success: false,
      errors: ["invalid id"],
    };

    expect(result).toStrictEqual(failedResult);
  });

  test("should catch an non-existant id and return errors", async () => {
    const result = await deleteTodoUseCase("this id does not exist!");
    const failedResult = {
      success: false,
      errors: ["todo was not found"],
    };

    expect(result).toStrictEqual(failedResult);
  });

  test("should delete the todo if the id is valid and exists", async () => {
    const { insertTodoDb, todos } = makeTestTodoRepository();
    await insertTodoDb().values(todos);

    const result = await deleteTodoUseCase(todos[0].id);

    expect(result).toStrictEqual({ success: true, todo: todos[0] });
  });
});
