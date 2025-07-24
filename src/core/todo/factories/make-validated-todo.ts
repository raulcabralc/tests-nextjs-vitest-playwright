import { sanitizeStr } from "@/core/helpers/sanitize-str";
import { validateTodoTask } from "../schemas/validate-todo-task";
import { makeNewTodo } from "./make-new-todo";
import { TodoDto } from "../schemas/todo.contract";

export function makeValidatedTodo(task: string): TodoDto {
  const cleanTask = sanitizeStr(task);
  const validatedTask = validateTodoTask(cleanTask);

  if (validatedTask.success) {
    return {
      success: true,
      todo: makeNewTodo(cleanTask),
    };
  }

  return {
    success: false,
    errors: validatedTask.errors,
  };
}
