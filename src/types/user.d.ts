export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRegistrationData = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  password: string;
};

export type UserLoginData = {
  email: string;
  password: string;
};

export type UserResetPasswordData = {
  email: string;
  newPassword: string;
  uuid: string;
};
