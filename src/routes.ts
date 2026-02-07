import { Router } from "express";
import { UrlController } from "./controller/url.controller";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    const urlController = new UrlController();

    router.get("/api/:shortUrl", urlController.getUrl);
    router.post("/api/url", urlController.createUrl);
    return router;
  }
}
