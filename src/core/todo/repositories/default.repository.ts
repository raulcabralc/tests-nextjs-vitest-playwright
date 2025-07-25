import { drizzleDatabase } from "@/database/drizzle";
import { DrizzleTodoRepository } from "./drizzle-todo.repository";
import { TodoRepository } from "./todo.contract.repository";

export const defaultTodoRepository: TodoRepository = new DrizzleTodoRepository(
  drizzleDatabase.db
);
