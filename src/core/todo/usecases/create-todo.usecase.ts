import { makeValidatedTodo } from "../factories/make-validated-todo";
import { defaultTodoRepository } from "../repositories/default.repository";

export async function createTodoUseCase(task: string) {
  const result = makeValidatedTodo(task);

  if (!result.success) {
    return result;
  }

  const createResult = await defaultTodoRepository.create(result.todo);

  return createResult;
}
