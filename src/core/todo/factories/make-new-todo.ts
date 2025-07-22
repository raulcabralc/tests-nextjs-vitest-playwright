export function makeNewTodo(task: string) {
  return {
    id: crypto.randomUUID(),
    task,
    createdAt: new Date().toISOString(),
  };
}
