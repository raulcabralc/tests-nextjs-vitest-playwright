type ValidateTodoTask = {
  success: boolean;
  errors: string[];
};

export function validateTodoTask(task: string): ValidateTodoTask {
  const errors = [];

  if (task.length <= 3) {
    errors.push("description should have more than 3 characters");
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
