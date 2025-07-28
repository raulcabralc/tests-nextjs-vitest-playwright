import { revalidatePath } from "next/cache";
import { createTodoUseCase } from "../usecases/create-todo.usecase";

export async function createTodoAction(task: string) {
  "use server";

  const createResult = await createTodoUseCase(task);

  if (createResult.success) {
    revalidatePath("/");
  }

  return createResult;
}
