import { DriverAvailabilityStatus } from "../data/app.constant";
import { IUser } from "./user.interface";

export interface IDriverAvailability {
  driver: IUser;
  checkInTime: Date;
  checkOutTime: Date;
  date: Date | string;
  status: `${DriverAvailabilityStatus}`;
  createdAt: string | Date;
  updatedAt: string | Date;
}
