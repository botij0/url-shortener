import AxiosMockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, test } from "vitest";

import { urlApi } from "@/api/url.api";
import { createShortUrl } from "./create-short-url.action";

describe("getStats", () => {
  const urlApiMock = new AxiosMockAdapter(urlApi);

  beforeEach(() => {
    urlApiMock.reset();
  });

  test("Can create an url", async () => {
    const longUrl = "https://test.com";
    urlApiMock.onPost("/url").reply(201, {
      originalUrl: longUrl,
      shortUrl: "t",
    });

    const response = await createShortUrl(longUrl);

    expect(response).toStrictEqual({
      originalUrl: longUrl,
      shortUrl: "t",
    });
  });

  test("should return null if status code !== 201", async () => {
    const longUrl = "https://test.com";
    urlApiMock.onPost("/url").reply(500, {});
    const response = await createShortUrl(longUrl);
    expect(response).toBeNull();
  });
});
