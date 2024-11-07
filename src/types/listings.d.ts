export type Listing = {
  id: string;
  title: string;
  description: string;
  city: string;
  price: number | float;
  available: boolean;
  image: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Type for updating Listing :)
export type CreateListing = {
  title: string;
  description: string;
  city: string;
  price: number | float;
  userId: string;
  image: string;
};
