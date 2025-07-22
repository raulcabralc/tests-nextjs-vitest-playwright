import { validateTodoTask } from "./validate-todo-task";

describe("validateTodoTask (unit)", () => {
  test("task should return success false", () => {
    expect(validateTodoTask("abc")).toStrictEqual({
      success: false,
      errors: ["description should have more than 3 characters"],
    });
  });

  test("task should reteurn success true", () => {
    expect(validateTodoTask("abcd")).toStrictEqual({
      success: true,
      errors: [],
    });
  });
});
