// Slutsatser om TypeScipt

// 1. Bra sätt att säkra upp så rätt data anges av användare.
// 2. Mer kod att hålla koll på men säkrare applikation. Förstår att detta kan säkra större applikationer.

export type Booking = {
  id: string;
  createdAt: Date;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  createdBy: UserBooking;

  property: string;
  userId: string;
  listingId: string;
  updatedAt: Date;
};

export type UserBooking = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};
