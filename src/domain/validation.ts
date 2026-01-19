import { badRequest } from "./errors.js";
import type { CreateReservationInput } from "./types.js";

export function parseCreateReservationBody(body: unknown): CreateReservationInput {
  if (!body || typeof body !== "object") throw badRequest("Body puuttuu tai on virheellinen JSON.");

  const b = body as Record<string, unknown>;
  const roomId = b.roomId;
  const start = b.start;
  const end = b.end;
  const title = b.title;

  if (typeof roomId !== "string" || roomId.trim() === "") throw badRequest("roomId on pakollinen string.");
  if (typeof start !== "string") throw badRequest("start on pakollinen string.");
  if (typeof end !== "string") throw badRequest("end on pakollinen string.");
  if (title !== undefined && typeof title !== "string") throw badRequest("title pitää olla string jos annettu.");

  return { roomId: roomId.trim(), start, end, title };
}

export function toDateOrThrow(iso: string, fieldName: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw badRequest(`${fieldName} ei ole kelvollinen aikaleima.`, { value: iso });
  }
  return d;
}
