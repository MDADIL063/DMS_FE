import { AccountType, ActivityStatus, UserRoles } from "../data/app.constant";

export interface IUser {
  _id?: number | string;
  name: string;
  email: string;
  contactNumber?: string;
  userName?: string;
  licenseNumber?: string;
  licenseExpiryDate: Date;
  role: `${UserRoles}`;
  imageUrl?: string;
  status?: `${ActivityStatus}`;
  googleId?: string;
  accountType: `${AccountType}`;
  createdAt: Date;
  updatedAt: Date;
}
