import { revalidatePath } from "next/cache";
import { InvalidTodo, ValidTodo } from "../schemas/todo.contract";
import * as createTodoUseCaseMod from "../usecases/create-todo.usecase";
import { createTodoAction } from "./create-todo.action";

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe("createTodoAction (unit)", () => {
  test("should call createTodoUseCase with the right values", async () => {
    const { createTodoUseCaseSpy, successResult } = makeMocks();
    const expectedParamCall = "any task";
    await createTodoAction(expectedParamCall);

    expect(
      createTodoUseCaseSpy.mockResolvedValue(successResult)
    ).toHaveBeenCalledExactlyOnceWith(expectedParamCall);
  });

  test("should call revalidatePath if usecase returns success", async () => {
    const { revalidatePathMocked, createTodoUseCaseSpy, successResult } =
      makeMocks();
    const expectedParamCall = "task!!";
    createTodoUseCaseSpy.mockResolvedValue(successResult);
    await createTodoAction(expectedParamCall);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith("/");
  });

  test("should return the same usecase value if it succeeds", async () => {
    const { createTodoUseCaseSpy, successResult } = makeMocks();
    const expectedParamCall = "task!!";
    createTodoUseCaseSpy.mockResolvedValue(successResult);
    const result = await createTodoAction(expectedParamCall);

    expect(result).toBe(successResult);
  });

  test("should return the same usecase value if it fails", async () => {
    const { createTodoUseCaseSpy, errorResult } = makeMocks();
    const expectedParamCall = "task!!";
    createTodoUseCaseSpy.mockResolvedValue(errorResult);
    const result = await createTodoAction(expectedParamCall);

    expect(result).toBe(errorResult);
  });
});

function makeMocks() {
  const successResult = {
    success: true,
    todo: {
      id: "id",
      task: "task",
      createdAt: "date",
    },
  } as ValidTodo;

  const errorResult = {
    success: false,
    errors: ["any", "error"],
  } as InvalidTodo;

  const createTodoUseCaseSpy = vi.spyOn(
    createTodoUseCaseMod,
    "createTodoUseCase"
  );

  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    successResult,
    errorResult,
    createTodoUseCaseSpy,
    revalidatePathMocked,
  };
}
