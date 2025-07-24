import { join } from "path";

const commonKeys = {
  drizzleSchemaFiles: ["./src/core/todo/schemas/drizzle-todo-table.schema.ts"],
  drizzleMigrationsFolder: join("src", "database", "drizzle"),
};

type ConfigsByEnv = {
  readonly databaseFile: string;
  readonly currentEnv: keyof EnvConfigs;
} & typeof commonKeys;

type EnvConfigs = typeof envConfig;

type AllowedEnvKeys = keyof EnvConfigs;

function isValidEnv(env: string): env is AllowedEnvKeys {
  return Object.keys(envConfig).includes(env);
}

export function checkEnv(): AllowedEnvKeys {
  const currentEnv = process.env.CURRENT_ENV;

  if (!currentEnv || !isValidEnv(currentEnv)) {
    throw new Error("Check the environment files and src/env/configs.");
  }

  return currentEnv;
}

export function getFullEnv() {
  const currentEnv = checkEnv();
  return envConfig[currentEnv];
}

export function getEnv<C extends keyof ConfigsByEnv>(key: C) {
  const currentEnv = checkEnv();
  const value = envConfig[currentEnv][key];
  return value;
}

const envConfig = {
  development: {
    databaseFile: "dev.db.sqlite3",
    currentEnv: "development",
    ...commonKeys,
  },
  production: {
    databaseFile: "prod.db.sqlite3",
    currentEnv: "production",
    ...commonKeys,
  },
  test: {
    databaseFile: "int.test.db.sqlite3",
    currentEnv: "test",
    ...commonKeys,
  },
  e2e: {
    databaseFile: "e2e.test.db.sqlite3",
    currentEnv: "e2e",
    ...commonKeys,
  },
};
