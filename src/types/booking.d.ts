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
