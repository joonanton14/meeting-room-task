import type { Reservation } from "../domain/types.js";
import { conflict } from "../domain/errors.js";

const store = new Map<string, Reservation>();

export const reservationRepo = {
  insert(r: Reservation) {
    // Estetään tahaton ylikirjoitus, jos id on jo olemassa
    if (store.has(r.id)) {
      throw conflict("Varaus id on jo olemassa.", { id: r.id });
    }
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
  },
  // Testejä varten: in-memory store tyhjennys testien välillä
  clearAll() {
    store.clear();
},
};
