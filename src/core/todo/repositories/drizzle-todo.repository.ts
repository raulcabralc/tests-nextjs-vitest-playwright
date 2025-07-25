import { DrizzleDatabase } from "@/database/drizzle";
import { Todo, TodoDto } from "../schemas/todo.contract";
import { TodoRepository } from "./todo.contract.repository";
import { todoTable } from "../schemas/drizzle-todo-table.schema";
import { eq } from "drizzle-orm";

export class DrizzleTodoRepository implements TodoRepository {
  constructor(private readonly database: DrizzleDatabase) {
    this.database = database;
  }

  async findAll(): Promise<Todo[]> {
    const all = await this.database.query.todo.findMany({
      orderBy: (todo, { desc }) => [desc(todo.createdAt), desc(todo.task)],
    });

    return all;
  }

  async create(todoData: Todo): Promise<TodoDto> {
    const existingTodo = await this.database.query.todo.findFirst({
      where: (todoTable, { eq, or }) =>
        or(eq(todoTable.id, todoData.id), eq(todoTable.task, todoData.task)),
    });

    if (existingTodo) {
      return {
        success: false,
        errors: ["todo already exists with this name or ID"],
      };
    }

    await this.database.insert(todoTable).values(todoData);

    return {
      success: true,
      todo: todoData,
    };
  }

  async remove(id: string): Promise<TodoDto> {
    const existingTodo = await this.database.query.todo.findFirst({
      where: (todoTable, { eq }) => eq(todoTable.id, id),
    });

    if (!existingTodo) {
      return {
        success: false,
        errors: ["todo was not found"],
      };
    }

    await this.database.delete(todoTable).where(eq(todoTable.id, id));

    return {
      success: true,
      todo: existingTodo,
    };
  }
}
