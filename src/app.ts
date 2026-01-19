import express from "express";
import { reservationsRouter } from "./routes/reservations.js";
import { ApiError } from "./domain/errors.js";

export const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(reservationsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.code,
      message: err.message,
      details: err.details ?? null
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "internal_error", message: "Internal server error" });
});
