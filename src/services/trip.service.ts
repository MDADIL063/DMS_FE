import { API_URLS } from "../data/app.constant";

import { HttpService } from "./http.service";
import { UtilService } from "./util.service";
import { IDriverAvailability } from "../interfaces/attendance.interface";
import { IFeedback, IFeedbackPayload } from "../interfaces/feedBack.interface";

export class TripService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async addTrip(trip: any): Promise<any> {
    const url = API_URLS.TRIPS;
    const response = await this.httpSvc.post(url, trip);
    return response.data.data;
  }

  //   async getFeedbackByDriver(driverId: string): Promise<IFeedback[]> {
  //     const url = `${API_URLS.FEEDBACK}/driver/${driverId}`;
  //     const response = await this.httpSvc.get(url);
  //     return response.data.data;
  //   }

  async updateTrip(id: string, payload: Partial<any>): Promise<IFeedback> {
    const url = `${API_URLS.TRIPS}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data.data;
  }
}
