import { ITrip } from "./trip.interface";
import { IUser } from "./user.interface";

export interface IFeedback {
  _id?: string;
  driver: IUser; // store ObjectId as string
  rating: number;
  comment?: string;
  createdBy: string; // store ObjectId as string
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  trip: ITrip;
}

export interface IFeedbackPayload {
  driver: string; // store ObjectId as string
  rating: number | null;
  trip: string;
  comment?: string;
}
