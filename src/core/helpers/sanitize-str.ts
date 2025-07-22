export function sanitizeStr(string: string): string {
  const clean =
    !string || typeof string !== "string" ? "" : string.trim().normalize();

  return clean;
}
