import { Todo } from "../schemas/todo.contract";

export function makeNewTodo(task: string): Todo {
  return {
    id: crypto.randomUUID(),
    task,
    createdAt: new Date().toISOString(),
  };
}
