import {
  InvalidTodo,
  makeValidatedTodo,
  ValidTodo,
} from "./make-validated-todo";
import * as SanitizeStrMod from "@/core/helpers/sanitize-str";
import * as ValidateTodoTaskMod from "../schemas/validate-todo-task";
import * as makeNewTodoMod from "./make-new-todo";

describe("makeValidatedTodo (unit)", () => {
  test("should call sanitizeStr with correct value", () => {
    // vi.spyOn -> intercepta uma função

    const { task, sanitizeStrSpy } = makeMocks();

    makeValidatedTodo(task);

    expect(sanitizeStrSpy).toHaveBeenCalledExactlyOnceWith(task);
  });

  test("should call validateTodoTask with sanitizeStr return", () => {
    const { task, validateTodoTaskSpy, sanitizeStrSpy } = makeMocks();

    const sanitizeStrReturn = "retorno sanitizeStr";

    sanitizeStrSpy.mockReturnValue(sanitizeStrReturn);

    makeValidatedTodo(task);

    expect(validateTodoTaskSpy).toHaveBeenCalledExactlyOnceWith(
      sanitizeStrReturn
    );
  });

  test("validatedTask should call makeNewTodo if it returns success", () => {
    const { task } = makeMocks();

    const result = makeValidatedTodo(task) as ValidTodo;

    expect(result.data.id).toBe("algum-id");
    expect(result.data.task).toBe("abcd");
    expect(result.success).toBe(true);
  });

  test("should return validatedTask.error if validation goes wrong", () => {
    const { task, validateTodoTaskSpy } = makeMocks();

    validateTodoTaskSpy.mockReturnValue({
      success: false,
      errors: ["any", "error"],
    });

    const result = makeValidatedTodo(task) as InvalidTodo;

    expect(result).toStrictEqual({ errors: ["any", "error"], success: false });
  });
});

const makeMocks = (task = "abcd") => {
  // .mockImplementaion(() => {})

  const sanitizeStrSpy = vi
    .spyOn(SanitizeStrMod, "sanitizeStr")
    .mockReturnValue(task);

  const validateTodoTaskSpy = vi
    .spyOn(ValidateTodoTaskMod, "validateTodoTask")
    .mockReturnValue({
      success: true,
      errors: [],
    });

  const todo = {
    id: "algum-id",
    task,
    createdAt: new Date().toISOString(),
  };

  const makeNewTodoSpy = vi
    .spyOn(makeNewTodoMod, "makeNewTodo")
    .mockReturnValue(todo);

  return {
    task,
    todo,
    sanitizeStrSpy,
    validateTodoTaskSpy,
    makeNewTodoSpy,
  };
};
