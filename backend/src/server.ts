import express, { Router } from "express";
import cors from "cors";

import { buildLogger } from "./config/logger";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly routes: Router;
  private readonly logger = buildLogger("server");

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        this.logger.log("Request", {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          durationMs: duration,
        });
      });
      next();
    });

    // Routes
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      this.logger.log("Server started", { port: this.port });
    });
  }
}
