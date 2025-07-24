import { getFullEnv } from "@/env/config";
import { defineConfig } from "drizzle-kit";

const { databaseFile, drizzleMigrationsFolder, drizzleSchemaFiles } =
  getFullEnv();

export default defineConfig({
  dialect: "sqlite",
  out: drizzleMigrationsFolder,
  schema: drizzleSchemaFiles,
  dbCredentials: {
    url: databaseFile,
  },
});
