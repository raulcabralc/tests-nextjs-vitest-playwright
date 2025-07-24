import { Todo, TodoDto } from "../schemas/todo.contract";

export interface FindAllRepository {
  findAll(): Promise<Todo[]>;
}

export interface CreateTodoRepository {
  create(todo: Todo): Promise<TodoDto>;
}

export interface DeleteTodoRepository {
  remove(id: string): Promise<TodoDto>;
}

export interface TodoRepository
  extends FindAllRepository,
    CreateTodoRepository,
    DeleteTodoRepository {}
