import type { Request, Response } from "express";

export class UrlController {
  constructor() {}

  public getUrl = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "GetURl" });
  };

  public createUrl = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Create URl" });
  };
}
