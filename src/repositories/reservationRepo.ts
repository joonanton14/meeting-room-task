import type { Reservation } from "../domain/types.js";

const store = new Map<string, Reservation>();

export const reservationRepo = {
  insert(r: Reservation) {
    store.set(r.id, r);
  },

  getById(id: string): Reservation | undefined {
    return store.get(id);
  },

  deleteById(id: string): boolean {
    return store.delete(id);
  },

  listByRoom(roomId: string): Reservation[] {
    return Array.from(store.values())
      .filter((r) => r.roomId === roomId)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }
};
