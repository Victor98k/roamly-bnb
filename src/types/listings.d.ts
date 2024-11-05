export type Listing = {
  id: string;
  title: string;
  description: string;
  city: string;
  price: number;
  available: boolean;
  image: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};
