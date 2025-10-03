import { TripStatus } from "../data/app.constant";
import { IUser } from "./user.interface";
import { IVehicle } from "./vehicle.interface";

export interface ITripForm {
  reason: string;
  description: string;
  itemToCarry: string;
  capacity: number;
  vehicle: IVehicle | string;
  startLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  endLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number;
  duration: string;
  price: string;
  startDateTime: any;
}

export interface ITrip {
  _id: string;
  status: `${TripStatus}`;
  reason: string;
  driver?: IUser | string;
  description: string;
  itemToCarry: string;
  capacity: number;
  vehicle: IVehicle;
  driver: IUser;
  customer: IUser;
  startLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  endLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number;
  duration: string;
  price: string;
  startDateTime: any;
  createdAt: Date;
  updatedAt: Date;
}
