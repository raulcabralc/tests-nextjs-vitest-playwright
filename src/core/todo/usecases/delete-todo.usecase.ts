import { sanitizeStr } from "@/core/helpers/sanitize-str";
import { defaultTodoRepository } from "../repositories/default.repository";

export async function deleteTodoUseCase(id: string) {
  const cleanId = sanitizeStr(id);

  if (!cleanId) {
    return {
      success: false,
      errors: ["invalid id"],
    };
  }

  const deleteResult = await defaultTodoRepository.remove(id);
  return deleteResult;
}
