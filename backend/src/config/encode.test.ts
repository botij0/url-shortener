import { encodeBase62 } from "./encode";

describe("encode", () => {
  describe("encodeBase62", () => {
    test("should return 'a' for zero", () => {
      expect(encodeBase62(0n)).toBe("a");
    });

    test("should encode single-digit values (1–61) to one character", () => {
      expect(encodeBase62(1n)).toBe("b");
      expect(encodeBase62(25n)).toBe("z");
      expect(encodeBase62(26n)).toBe("A");
      expect(encodeBase62(51n)).toBe("Z");
      expect(encodeBase62(52n)).toBe("0");
      expect(encodeBase62(61n)).toBe("9");
    });

    test("should encode 62 as 'ab'", () => {
      expect(encodeBase62(62n)).toBe("ab");
    });

    test("should encode 63 as 'bb'", () => {
      expect(encodeBase62(63n)).toBe("bb");
    });

    test("should encode larger numbers correctly", () => {
      // 3844 = 62² → digits 0,0,1 → "aab"
      expect(encodeBase62(3844n)).toBe("aab");
      // 3845 = 62² + 1 → "bab"
      expect(encodeBase62(3845n)).toBe("bab");
    });

    test("should handle large bigint values", () => {
      const big = 12345678901234567890n;
      const result = encodeBase62(big);
      expect(result.length).toBeGreaterThan(1);
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });
});
