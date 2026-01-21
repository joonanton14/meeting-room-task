import { conflict, notFound, badRequest } from "../domain/errors.js";
import { reservationRepo } from "../repositories/reservationRepo.js";
import type { CreateReservationInput, Reservation } from "../domain/types.js";
import { toDateOrThrow } from "../domain/validation.js";

function id(): string {
  return `r_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

// Overlap rule: [start, end) — end == other.start ei ole päällekkäinen
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export const reservationService = {
  create(input: CreateReservationInput): Reservation {
    const startDate = toDateOrThrow(input.start, "start");
    const endDate = toDateOrThrow(input.end, "end");

    if (!(startDate < endDate)) {
      throw badRequest("Aloitusajan täytyy olla ennen lopetusaikaa.", { start: input.start, end: input.end });
    }

    const now = new Date();
    if (endDate.getTime() <= now.getTime()) {
    throw badRequest("Varaus ei voi päättyä menneisyydessä.", { end: input.end, now: now.toISOString() });
    }

    if (startDate.getTime() < now.getTime()) {
    throw badRequest("Varaus ei voi alkaa menneisyydessä.", { start: input.start, now: now.toISOString() });
    }

    const existing = reservationRepo.listByRoom(input.roomId);
    for (const r of existing) {
      const rStart = new Date(r.start);
      const rEnd = new Date(r.end);
      if (overlaps(startDate, endDate, rStart, rEnd)) {
        throw conflict("Varaus menee päällekkäin olemassa olevan varauksen kanssa.", {
          conflictingReservationId: r.id,
          requested: { start: input.start, end: input.end },
          existing: { start: r.start, end: r.end }
        });
      }
    }

    const created: Reservation = {
      id: id(),
      roomId: input.roomId,
      start: input.start,
      end: input.end,
      title: input.title,
      createdAt: new Date().toISOString()
    };

    reservationRepo.insert(created);
    return created;
  },

  cancel(id: string): void {
  if (!id || id.trim() === "") throw badRequest("id puuttuu.");

  const found = reservationRepo.getById(id);
  if (!found) throw notFound("Varausta ei löydy.", { id });

  reservationRepo.deleteById(id);
  },

  listRoom(roomId: string): Reservation[] {
    if (!roomId || roomId.trim() === "") throw badRequest("roomId puuttuu.");
    return reservationRepo.listByRoom(roomId.trim());
  }
};
