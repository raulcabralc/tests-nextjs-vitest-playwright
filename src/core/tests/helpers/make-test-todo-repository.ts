import { DrizzleTodoRepository } from "@/core/todo/repositories/drizzle-todo.repository";
import { drizzleDatabase } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export function makeTestTodoRepository() {
  const { db, todoTable } = drizzleDatabase;
  const repository = new DrizzleTodoRepository(db);
  const todos = makeTestTodos();

  const insertTodoDb = () => db.insert(todoTable);
  const deleteTodoDb = (id: string) =>
    db.delete(todoTable).where(eq(todoTable.id, id));
  const deleteTodoNoWhere = () => db.delete(todoTable);

  return { todos, repository, insertTodoDb, deleteTodoDb, deleteTodoNoWhere };
}

export const insertTestTodos = async () => {
  const { insertTodoDb } = makeTestTodoRepository();
  const todos = makeTestTodos();

  await insertTodoDb().values(todos);

  return todos;
};

export const makeTestTodos = () => {
  return Array.from({ length: 5 }).map((_, index) => {
    const newTodo = {
      id: index.toString(),
      task: `Todo ${index}`,
      createdAt: `date ${index}`,
    };
    return newTodo;
  });
};
