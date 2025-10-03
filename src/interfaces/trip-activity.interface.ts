import { TripStatus } from "../data/app.constant";
import { ITrip } from "./trip.interface";

export interface ITripActivity {
  _id: string;
  trip: ITrip;
  tripStatus: `${TripStatus}`;
  message: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
