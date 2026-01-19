import { Router } from "express";
import { reservationService } from "../services/reservationService.js";
import { parseCreateReservationBody } from "../domain/validation.js";

export const reservationsRouter = Router();

// 1) Luo varaus
reservationsRouter.post("/reservations", (req, res, next) => {
  try {
    const input = parseCreateReservationBody(req.body);
    const created = reservationService.create(input);
    return res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// 2) Peru varaus
reservationsRouter.delete("/reservations/:id", (req, res, next) => {
  try {
    reservationService.cancel(req.params.id);
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// 3) Listaa huoneen varaukset
reservationsRouter.get("/rooms/:roomId/reservations", (req, res, next) => {
  try {
    const list = reservationService.listRoom(req.params.roomId);
    return res.json(list);
  } catch (e) {
    next(e);
  }
});
