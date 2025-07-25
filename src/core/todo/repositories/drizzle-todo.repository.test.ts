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
    test("creates a todo if all the data is valid", async () => {});

    test("fails if there is a task with the same name in the table", async () => {});

    test("fails if there is a task with the same ID in the table", async () => {});
  });

  describe("remove", () => {
    test("deletes a todo if it exists", async () => {});

    test("fails to delete the todo if it doesn't exists", async () => {});
  });
});
