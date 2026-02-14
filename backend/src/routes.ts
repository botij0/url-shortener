import { Router } from "express";
import { UrlController } from "./controllers/url.controller";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    const urlController = new UrlController();

    router.get("/api/stats", urlController.getStats);
    router.post("/api/url", urlController.createUrl);
    router.get("/:shortUrl", urlController.getUrl);
    return router;
  }
}
