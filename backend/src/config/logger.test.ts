import { buildLogger } from "./logger";


describe("logger", () => {
  const service = "test-service";

  describe("buildLogger", () => {
    test("should return an object with log, warn, and error methods", () => {
      const logger = buildLogger(service);
      expect(logger).toHaveProperty("log");
      expect(logger).toHaveProperty("warn");
      expect(logger).toHaveProperty("error");
      expect(typeof logger.log).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.error).toBe("function");
    });
  });
});
