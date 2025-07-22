import { makeNewTodo } from "./make-new-todo";

describe("makeNewTodo (unit)", () => {
  test("should return a new valid todo", () => {
    // AAA -> Arrange, Act, Assert

    // Arrange | Criar as coisas que preciso
    const expectedTodo = {
      id: expect.any(String),
      task: "ToDo!!",
      createdAt: expect.any(String),
    };

    // Act | Executar a ação que está sendo testada
    const newTodo = makeNewTodo("ToDo!!");

    // Assert | Espera um resultado
    expect(newTodo).toStrictEqual(expectedTodo);
  });
});
