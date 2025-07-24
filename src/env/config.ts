type EnvConfigs = typeof envConfig;

type AllowedEnvKeys = keyof EnvConfigs;

function isValidEnv(env: string): env is AllowedEnvKeys {
  return Object.keys(envConfig).includes(env);
}

export function checkEnv(): AllowedEnvKeys {
  const currentEnv = process.env.CURRENT_ENV;

  if (!currentEnv || !isValidEnv(currentEnv)) {
    throw new Error("Check the environment files.");
  }

  return currentEnv;
}

export function getFullEnv() {
  const currentEnv = checkEnv();
  return envConfig[currentEnv];
}

const envConfig = {
  development: {
    databaseFile: "dev.db.sqlite3",
    currentEnv: "development",
  },
  production: {
    databaseFile: "prod.db.sqlite3",
    currentEnv: "production",
  },
  test: {
    databaseFile: "int.test.db.sqlite3",
    currentEnv: "test",
  },
  e2e: {
    databaseFile: "e2e.test.db.sqlite3",
    currentEnv: "e2e",
  },
};
