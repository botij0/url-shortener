import type { Request, Response } from "express";
import { prisma } from "../data/postgres";
import { CreateUrlDto } from "../data/dtos/create-url.dto";

export class UrlController {
  constructor() {}

  public getUrl = async (req: Request, res: Response) => {
    const shortUrl = req.params.shortUrl;

    if (typeof shortUrl !== "string")
      return res.status(400).json({ error: "Wrong Short Url" });

    const url = await prisma.url.findFirst({
      where: { short_url: shortUrl },
    });

    url
      ? res.status(302).redirect(url.long_url)
      : res.status(404).json({ error: `Url ${shortUrl} not found` });
  };

  public createUrl = async (req: Request, res: Response) => {
    const [error, createUrlDto] = CreateUrlDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const url = await prisma.url.create({
      data: createUrlDto!,
    });
    return res.json(url);
  };
}
