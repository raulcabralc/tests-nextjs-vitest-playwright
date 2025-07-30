import { revalidatePath } from "next/cache";
import { deleteTodoUseCase } from "../usecases/delete-todo.usecase";
import { devOnlyDelay } from "@/core/helpers/dev-only-delay";

export async function deleteTodoAction(id: string) {
  "use server";

  await devOnlyDelay(200);

  const deleteResult = await deleteTodoUseCase(id);

  if (deleteResult.success) {
    revalidatePath("/");
  }

  return deleteResult;
}
