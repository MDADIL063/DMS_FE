import { ActivityStatus } from "../data/app.constant";
import { IVehicleType } from "./vehicle-type.interface";

export interface IVehicle {
  _id?: string;
  vehicleNumber: string;
  company: string;
  capacity: string;
  mfgYear?: any;
  vehicleType: IVehicleType;
  chassisNumber?: string;
  regNumber?: string;
  imageUrls?: IVehicleImage[];
  status: `${ActivityStatus}`;
  insuranceNumber: string;
  insuranceExpiryDate: Date | string;
  fitnessNumber: string;
  fitnessExpiryDate: Date | string;
  costPerKm: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IVehicleImage {
  id: string;
  imageUrl: string;
}
