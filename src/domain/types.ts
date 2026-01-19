export type IsoDateTime = string;

export type Reservation = {
  id: string;
  roomId: string;
  start: IsoDateTime;
  end: IsoDateTime;
  title?: string;
  createdAt: IsoDateTime;
};

export type CreateReservationInput = {
  roomId: string;
  start: IsoDateTime;
  end: IsoDateTime;
  title?: string;
};
