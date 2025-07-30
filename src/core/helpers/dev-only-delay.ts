import { getFullEnv } from "@/env/config";

export async function devOnlyDelay(delay: number = 1000): Promise<void> {
  const { currentEnv } = getFullEnv();

  const envsToDelay = ["e2e", "test", "development"];

  const shouldDelay = delay > 0 && envsToDelay.includes(currentEnv);

  if (shouldDelay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  return;
}
