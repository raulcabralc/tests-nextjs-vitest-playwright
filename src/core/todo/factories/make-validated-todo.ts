import { sanitizeStr } from "@/core/helpers/sanitize-str";
import { validateTodoTask } from "../schemas/validate-todo-task";
import { makeNewTodo } from "./make-new-todo";
import { Todo } from "../schemas/todo.contract";

type InvalidTodo = {
  success: false;
  errors: string[];
};

type ValidTodo = {
  success: true;
  data: Todo;
};

type MixedValidationTodo = ValidTodo | InvalidTodo;

export function makeValidatedTodo(task: string): MixedValidationTodo {
  const cleanTask = sanitizeStr(task);
  const validatedTask = validateTodoTask(cleanTask);

  if (validatedTask.success) {
    return {
      success: true,
      data: makeNewTodo(cleanTask),
    };
  }

  return {
    success: false,
    errors: validatedTask.errors,
  };
}
