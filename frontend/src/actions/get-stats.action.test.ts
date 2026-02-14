import AxiosMockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, test } from "vitest";

import { urlApi } from "@/api/url.api";
import { getStats } from "./get-stats.action";

describe("getStats", () => {
  const urlApiMock = new AxiosMockAdapter(urlApi);

  beforeEach(() => {
    urlApiMock.reset();
  });

  test("should return stats", async () => {
    urlApiMock.onGet("/stats").reply(200, {
      urls: 18,
      clicks: 5,
    });

    const response = await getStats();

    expect(response).toStrictEqual({
      urls: 18,
      clicks: 5,
    });
  });

  test("should return empty stats if server error", async () => {
    const result = await getStats().catch((error) => {
      expect(error).toBeDefined();
      expect(error.message).toBe("Request failed with status code 404");
    });

    expect(result).toStrictEqual({
      urls: 0,
      clicks: 0,
    });
  });
});
