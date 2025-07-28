import { deleteTodoAction } from "./delete-todo.action";
import { deleteMocks } from "@/core/tests/helpers/make-test-todo-mocks";

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
  };
});

describe("deleteTodoAction", () => {
  test("should call deleteTodoUseCase with the right values", async () => {
    const { deleteTodoUseCaseSpy, successResult } = deleteMocks();
    const expectedParamCall = "any task";
    await deleteTodoAction(expectedParamCall);

    expect(
      deleteTodoUseCaseSpy.mockResolvedValue(successResult)
    ).toHaveBeenCalledExactlyOnceWith(expectedParamCall);
  });

  test("should call revalidatePath if usecase returns success", async () => {
    const { revalidatePathMocked, deleteTodoUseCaseSpy, successResult } =
      deleteMocks();
    const expectedParamCall = "task!!";
    deleteTodoUseCaseSpy.mockResolvedValue(successResult);
    await deleteTodoAction(expectedParamCall);

    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith("/");
  });

  test("should return the same usecase value if it succeeds", async () => {
    const { deleteTodoUseCaseSpy, successResult } = deleteMocks();
    const expectedParamCall = "task!!";
    deleteTodoUseCaseSpy.mockResolvedValue(successResult);
    const result = await deleteTodoAction(expectedParamCall);

    expect(result).toBe(successResult);
  });

  test("should return the same usecase value if it fails", async () => {
    const { deleteTodoUseCaseSpy, errorResult } = deleteMocks();
    const expectedParamCall = "task!!";
    deleteTodoUseCaseSpy.mockResolvedValue(errorResult);
    const result = await deleteTodoAction(expectedParamCall);

    expect(result).toBe(errorResult);
  });
});
