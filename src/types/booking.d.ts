// export type Customer = {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
// };

export type Booking = {
  id: string;
  createdAt: Date;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  property: string;
  userId: string;
  listingId: string;
  updatedAt: Date;

  user: UserBooking;
};

export type UserBooking = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};
