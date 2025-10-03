import { API_URLS } from "../data/app.constant";

import { HttpService } from "./http.service";
import { UtilService } from "./util.service";
import { ITrip } from "../interfaces/trip.interface";
import { IListResponse } from "../interfaces/response.interface";
import { ITripFilters } from "../interfaces/filter.interface";

export class TripService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async addTrip(trip: any): Promise<any> {
    const url = API_URLS.TRIPS;
    const response = await this.httpSvc.post(url, trip);
    return response.data.data;
  }

  async getTripCount(): Promise<any> {
    const response = await this.httpSvc.get(`${API_URLS.TRIPS}/trips-count`);
    return response.data; // will contain total, new, scheduled, etc.
  }

  async getSingleTrip(id: string): Promise<ITrip> {
    const url = `${API_URLS.TRIPS}/${id}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async updateTrip(id: string, payload: Partial<any>): Promise<ITrip> {
    const url = `${API_URLS.TRIPS}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data.data;
  }

  async getTrips(filters?: ITripFilters): Promise<IListResponse> {
    const response = await this.httpSvc.get(API_URLS.TRIPS, { params: filters });
    return {
      total: response.data.total,
      data: response.data.data,
    };
  }

  async assignDriverToTrip(tripId: string, driverId: string): Promise<ITrip> {
    const url = `${API_URLS.TRIPS}/${tripId}/assign-driver/${driverId}`;
    const response = await this.httpSvc.put(url, {});
    return response.data.data;
  }

  async updateTripStatus(tripId: string, payload: any): Promise<ITrip> {
    const url = `${API_URLS.TRIPS}/${tripId}/update-status`;
    const response = await this.httpSvc.put(url, payload);
    return response.data.data;
  }
}
