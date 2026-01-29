import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { reservationRepo } from "../repositories/reservationRepo.js";

describe("Reservations API", () => {
  beforeEach(() => {
    reservationRepo.clearAll();
  });

  it("Creates reservation", async () => {
    
    const payload = {
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
      title: "Testi",
    };

    const res = await request(app).post("/reservations").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.roomId).toBe("A");
    expect(res.body.start).toBe(payload.start);
    expect(res.body.end).toBe(payload.end);
    expect(res.body.title).toBe("Testi");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("409 when overlaps in same room", async () => {
    await request(app).post("/reservations").send({
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
    }).expect(201);

    const overlapping = {
      roomId: "A",
      start: "2030-01-01T10:30:00.000Z",
      end: "2030-01-01T11:30:00.000Z",
    };
    const res = await request(app).post("/reservations").send(overlapping);
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("conflict");
  });

  it("201 when end == other start (no overlap)", async () => {
    await request(app).post("/reservations").send({
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
    }).expect(201);

    const touching = {
      roomId: "A",
      start: "2030-01-01T11:00:00.000Z",
      end: "2030-01-01T12:00:00.000Z",
    };
    const res = await request(app).post("/reservations").send(touching);

    expect(res.status).toBe(201);
    expect(res.body.roomId).toBe("A");
  });

  it("400 when start is in the past", async () => {
    const past = {
      roomId: "A",
      start: "2000-01-01T10:00:00.000Z",
      end: "2000-01-01T11:00:00.000Z",
    };
    const res = await request(app).post("/reservations").send(past);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("bad_request");
  });

  it("400 when start >= end", async () => {
    const invalid = {
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T10:00:00.000Z",
    };
    const res = await request(app).post("/reservations").send(invalid);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("bad_request");
  });

  it("400 when roomId/start/end are empty strings", async () => {
    const invalid = {
      roomId: "   ",
      start: "",
      end: "   ",
    };
    const res = await request(app).post("/reservations").send(invalid);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("bad_request");
  });

  it("reservations trims title and drops empty title", async () => {
    const payload = {
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
      title: "   ",
    };
    const res = await request(app).post("/reservations").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.title).toBeUndefined();
  });

  it("reservations returns sorted by start", async () => {
    await request(app).post("/reservations").send({
      roomId: "A",
      start: "2030-01-01T12:00:00.000Z",
      end: "2030-01-01T13:00:00.000Z",
    }).expect(201);

    await request(app).post("/reservations").send({
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
    }).expect(201);

    const res = await request(app).get("/rooms/A/reservations");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].start).toBe("2030-01-01T10:00:00.000Z");
    expect(res.body[1].start).toBe("2030-01-01T12:00:00.000Z");
  });

  it("Reservations delete -> 204 then second delete -> 404", async () => {
    const created = await request(app).post("/reservations").send({
      roomId: "A",
      start: "2030-01-01T10:00:00.000Z",
      end: "2030-01-01T11:00:00.000Z",
    }).expect(201);

    const id = created.body.id;
    const del1 = await request(app).delete(`/reservations/${id}`);
    const del2 = await request(app).delete(`/reservations/${id}`);

    expect(del1.status).toBe(204);
    expect(del2.status).toBe(404);
    expect(del2.body.error).toBe("not_found");
  });
});
