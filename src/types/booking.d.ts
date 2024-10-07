type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type Booking = {
  id: string;
  createdAt: Date;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  customer: Customer;
  createdBy: string;
  property: string;
  userId: string; // Ensure this is included
  propertyId: string; // Ensure this is included if needed
};
