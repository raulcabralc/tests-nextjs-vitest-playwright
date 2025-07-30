import { revalidatePath } from "next/cache";
import { createTodoUseCase } from "../usecases/create-todo.usecase";
import { devOnlyDelay } from "@/core/helpers/dev-only-delay";

export async function createTodoAction(task: string) {
  "use server";

  await devOnlyDelay(100);

  const createResult = await createTodoUseCase(task);

  if (createResult.success) {
    revalidatePath("/");
  }

  return createResult;
}
