import { createTodoAction } from "./create-todo.action";
import { createMocks } from "@/core/tests/helpers/make-test-todo-mocks";

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe("createTodoAction (unit)", () => {
  test("should call createTodoUseCase with the right values", async () => {
    const { createTodoUseCaseSpy, successResult } = createMocks();
    const expectedParamCall = "any task";
    await createTodoAction(expectedParamCall);

    expect(
      createTodoUseCaseSpy.mockResolvedValue(successResult)
    ).toHaveBeenCalledExactlyOnceWith(expectedParamCall);
  });

  test("should call revalidatePath if usecase returns success", async () => {
    const { revalidatePathMocked, createTodoUseCaseSpy, successResult } =
      createMocks();
    const expectedParamCall = "task!!";
    createTodoUseCaseSpy.mockResolvedValue(successResult);
    await createTodoAction(expectedParamCall);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith("/");
  });

  test("should return the same usecase value if it succeeds", async () => {
    const { createTodoUseCaseSpy, successResult } = createMocks();
    const expectedParamCall = "task!!";
    createTodoUseCaseSpy.mockResolvedValue(successResult);
    const result = await createTodoAction(expectedParamCall);

    expect(result).toBe(successResult);
  });

  test("should return the same usecase value if it fails", async () => {
    const { createTodoUseCaseSpy, errorResult } = createMocks();
    const expectedParamCall = "task!!";
    createTodoUseCaseSpy.mockResolvedValue(errorResult);
    const result = await createTodoAction(expectedParamCall);

    expect(result).toBe(errorResult);
  });
});
