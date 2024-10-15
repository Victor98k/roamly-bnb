export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type Booking = {
  id: string;
  createdAt: Date;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  customer: Customer;
  createdBy: string;
  property: string;
  userId: string;
  listingId: string;
};
