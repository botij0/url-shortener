import { CreateUrlDto } from "./create-url.dto";

describe("create-url.dto", () => {
  const URL = "https://test.com";
  test("should return a DTO if correct params", () => {
    const result = CreateUrlDto.create({ longUrl: URL });
    expect(result[0]).toBe(undefined);
    expect(result[1]).toBeInstanceOf(CreateUrlDto);
  });

  test("should return error message if longURl is not present", async () => {
    const result = CreateUrlDto.create({ a: 1 });
    expect(result[0]).toBe("Long Url is required");
    expect(result[1]).toBe(undefined);
  });

  test("should return erro message if longURl is not a string", async () => {
    const result = CreateUrlDto.create({ longUrl: 1 });
    expect(result[0]).toBe("Long Url is required");
    expect(result[1]).toBe(undefined);
  });

  test("should return error message if longURl is an invalid Url", async () => {
    const result = CreateUrlDto.create({ longUrl: "invalid url" });
    expect(result[0]).toBe("Please provide a valid URL (e.g. https://example.com)");
    expect(result[1]).toBe(undefined);
  });
});
