import { encodeBase62 } from "../config/encode";
import { prisma } from "../data/postgres";
import { buildLogger } from "../config/logger";

export class UrlService {
  protected readonly logger;

  constructor() {
    this.logger = buildLogger("url.service.js");
  }

  public async getLongUrl(shortUrl: string) {
    try {
      const url = await prisma.url.update({
        where: { short_url: shortUrl },
        data: { counter: { increment: 1 } },
      });
      this.logger.log("Short URL resolved", {
        shortUrl,
        redirectTo:
          url.long_url.length > 80 ? `${url.long_url.slice(0, 80)}...` : url.long_url,
      });
      return url;
    } catch (error) {
      this.logger.error(
        `Error getting a long url from Database: { params: ${shortUrl}, error: ${error}}`,
      );
      return null;
    }
  }

  public async createShortUrl(longUrl: string) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const created = await tx.url.create({
          data: {
            long_url: longUrl,
          },
        });

        const shortUrl = encodeBase62(created.id);

        const updated = await tx.url.update({
          where: { id: created.id },
          data: { short_url: shortUrl },
        });

        return updated;
      });

      this.logger.log("Short URL created", {
        shortUrl: result.short_url,
        longUrl: longUrl.length > 100 ? `${longUrl.slice(0, 100)}...` : longUrl,
        id: result.id,
      });
      return result;
    } catch (error) {
      this.logger.error(
        `Error creating shortUrl: { params: ${longUrl}, error: ${error}}`,
      );
      return undefined;
    }
  }

  public async getStats() {
    try {
      const totalUrls = await prisma.url.count();
      const totalClicks = await prisma.url.aggregate({
        _sum: {
          counter: true,
        },
      });

      const clicks = totalClicks._sum.counter || 0;
      this.logger.log("Stats retrieved", { urls: totalUrls, clicks });
      return {
        urls: totalUrls,
        clicks,
      };
    } catch (error) {
      this.logger.error(`Error getting stats from database: ${error}`);
      return null;
    }
  }
}
