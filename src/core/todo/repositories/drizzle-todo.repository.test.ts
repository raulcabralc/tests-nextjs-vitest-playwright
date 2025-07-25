import {
  insertTestTodos,
  makeTestTodoRepository,
} from "@/core/tests/helpers/make-test-todo-repository";

describe("DrizzleTodoRepository (integration)", () => {
  beforeEach(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();

    await deleteTodoNoWhere();
  });

  afterAll(async () => {
    const { deleteTodoNoWhere } = makeTestTodoRepository();

    await deleteTodoNoWhere();
  });

  describe("findAll", () => {
    test("should return and empty array if the table is empty", async () => {
      const { repository } = makeTestTodoRepository();
      const result = await repository.findAll();

      expect(result).toStrictEqual([]);
      expect(result).toHaveLength(0);
    });

    test("should return all todos in descending order", async () => {
      const { repository } = makeTestTodoRepository();

      await insertTestTodos();

      const result = await repository.findAll();

      expect(result[0].createdAt).toBe("date 4");
      expect(result[1].createdAt).toBe("date 3");
      expect(result[2].createdAt).toBe("date 2");
      expect(result[3].createdAt).toBe("date 1");
      expect(result[4].createdAt).toBe("date 0");
    });
  });

  describe("create", () => {
    test("creates a todo if all the data is valid", async () => {
      const { repository, todos } = makeTestTodoRepository();

      const newTodo = await repository.create(todos[0]);

      expect(newTodo).toStrictEqual({ success: true, todo: todos[0] });
    });

    test("fails if there is a task with the same name in the table", async () => {
      const { repository, todos } = makeTestTodoRepository();

      await repository.create(todos[0]);
      const secondTodo = await repository.create({
        id: "99",
        task: todos[0].task,
        createdAt: "date 99",
      });

      expect(secondTodo).toStrictEqual({
        success: false,
        errors: ["todo already exists with this name or ID"],
      });
    });

    test("fails if there is a task with the same ID in the table", async () => {
      const { repository, todos } = makeTestTodoRepository();

      await repository.create(todos[0]);
      const secondTodo = await repository.create({
        id: todos[0].id,
        task: "task 99",
        createdAt: "date 99",
      });

      expect(secondTodo).toStrictEqual({
        success: false,
        errors: ["todo already exists with this name or ID"],
      });
    });
  });

  describe("remove", () => {
    test("deletes a todo if it exists", async () => {
      const { repository, todos } = makeTestTodoRepository();

      await repository.create(todos[0]);
      await repository.remove(todos[0].id);

      const result = await repository.findAll();
      expect(result).toStrictEqual([]);
    });

    test("fails to delete the todo if it doesn't exists", async () => {
      const { repository, todos } = makeTestTodoRepository();

      const removedTodo = await repository.remove(todos[4].id);

      expect(removedTodo).toStrictEqual({
        success: false,
        errors: ["todo was not found"],
      });
    });
  });
});
