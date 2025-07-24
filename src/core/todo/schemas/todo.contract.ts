export type Todo = {
  id: string;
  task: string;
  createdAt: string;
};

export type InvalidTodo = {
  success: false;
  errors: string[];
};

export type ValidTodo = {
  success: true;
  todo: Todo;
};

export type TodoDto = ValidTodo | InvalidTodo;
