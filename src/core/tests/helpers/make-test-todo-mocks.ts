import { revalidatePath } from "next/cache";
import { InvalidTodo, ValidTodo } from "@/core/todo/schemas/todo.contract";
import * as createTodoUseCaseMod from "@/core/todo/usecases/create-todo.usecase";

import * as deleteTodoUseCaseMod from "@/core/todo/usecases/delete-todo.usecase";

function createMocks() {
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

function deleteMocks() {
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

  const deleteTodoUseCaseSpy = vi.spyOn(
    deleteTodoUseCaseMod,
    "deleteTodoUseCase"
  );

  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    successResult,
    errorResult,
    deleteTodoUseCaseSpy,
    revalidatePathMocked,
  };
}

export { createMocks, deleteMocks };
