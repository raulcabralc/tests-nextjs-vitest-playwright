import { sanitizeStr } from "./sanitize-str";

describe("sanitizeStr (unit)", () => {
  test("returns an empty string if value is falsy", () => {
    // @ts-expect-error | testando a função sem parâmetros
    expect(sanitizeStr()).toBe("");
  });

  test("returns an empty string if value is not a string", () => {
    // @ts-expect-error | parâmetros number
    expect(sanitizeStr(123)).toBe("");
  });

  test("returns trimmed string", () => {
    expect(sanitizeStr("  a aa   ")).toBe("a aa");
  });

  test("returns string normalized with NFC", () => {
    const original = "e\u0301";
    expect(sanitizeStr(original)).toBe("é");
  });
});
