import { UrlService } from "./url.service";
import { prisma } from "../data/postgres";
import { encodeBase62 } from "../config/encode";
import { buildLogger } from "../config/logger";

jest.mock("../data/postgres", () => ({
  prisma: {
    url: {
      update: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("../config/encode", () => ({
  encodeBase62: jest.fn(),
}));

jest.mock("../config/logger", () => ({
  buildLogger: jest.fn(),
}));

describe("UrlService", () => {
  let service: UrlService;
  let mockLogger: { log: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    (buildLogger as jest.Mock).mockReturnValue(mockLogger);

    service = new UrlService();
  });

  describe("getLongUrl", () => {
    it("should return url and increment counter", async () => {
      const mockUrl = {
        id: 1,
        short_url: "abc123",
        long_url: "https://example.com",
        counter: 1,
      };

      (prisma.url.update as jest.Mock).mockResolvedValue(mockUrl);

      const result = await service.getLongUrl("abc123");

      expect(prisma.url.update).toHaveBeenCalledWith({
        where: { short_url: "abc123" },
        data: { counter: { increment: 1 } },
      });

      expect(mockLogger.log).toHaveBeenCalledWith(
        "Short URL resolved",
        expect.objectContaining({
          shortUrl: "abc123",
        }),
      );

      expect(result).toEqual(mockUrl);
    });

    it("should return null if database throws", async () => {
      (prisma.url.update as jest.Mock).mockRejectedValue(new Error("DB error"));

      const result = await service.getLongUrl("fail");

      expect(mockLogger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("createShortUrl", () => {
    it("should create and return short url", async () => {
      const created = { id: 10, long_url: "https://example.com" };
      const updated = {
        id: 10,
        long_url: "https://example.com",
        short_url: "xyz789",
      };

      (encodeBase62 as jest.Mock).mockReturnValue("xyz789");

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        return callback({
          url: {
            create: jest.fn().mockResolvedValue(created),
            update: jest.fn().mockResolvedValue(updated),
          },
        });
      });

      const result = await service.createShortUrl("https://example.com");

      expect(encodeBase62).toHaveBeenCalledWith(10);
      expect(mockLogger.log).toHaveBeenCalledWith(
        "Short URL created",
        expect.objectContaining({
          shortUrl: "xyz789",
          id: 10,
        }),
      );

      expect(result).toEqual(updated);
    });

    it("should return undefined if transaction fails", async () => {
      (prisma.$transaction as jest.Mock).mockRejectedValue(
        new Error("Transaction failed"),
      );

      const result = await service.createShortUrl("bad-url");

      expect(mockLogger.error).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("getStats", () => {
    it("should return stats", async () => {
      (prisma.url.count as jest.Mock).mockResolvedValue(5);
      (prisma.url.aggregate as jest.Mock).mockResolvedValue({
        _sum: { counter: 20 },
      });

      const result = await service.getStats();

      expect(prisma.url.count).toHaveBeenCalled();
      expect(prisma.url.aggregate).toHaveBeenCalledWith({
        _sum: { counter: true },
      });

      expect(mockLogger.log).toHaveBeenCalledWith("Stats retrieved", {
        urls: 5,
        clicks: 20,
      });

      expect(result).toEqual({ urls: 5, clicks: 20 });
    });

    it("should return null if error occurs", async () => {
      (prisma.url.count as jest.Mock).mockRejectedValue(new Error("DB error"));

      const result = await service.getStats();

      expect(mockLogger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
