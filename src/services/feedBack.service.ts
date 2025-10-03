import { API_URLS } from "../data/app.constant";

import { HttpService } from "./http.service";
import { UtilService } from "./util.service";
import { IDriverAvailability } from "../interfaces/attendance.interface";
import { IFeedback, IFeedbackPayload } from "../interfaces/feedBack.interface";
import { ITrip } from "../interfaces/trip.interface";

export class FeedBackService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  //   async driverCheckIn(): Promise<IDriverAvailability> {
  //     const url = API_URLS.CHECK_IN;
  //     const response = await this.httpSvc.post(url, {});
  //     return response.data;
  //   }

  //   async driverCheckOut(): Promise<IDriverAvailability> {
  //     const url = API_URLS.CHECK_OUT; // e.g. "/api/availability/check-out"
  //     const response = await this.httpSvc.post(url, {});
  //     return response.data;
  //   }
  //   async driverTodaysAvailability(): Promise<{ data: IDriverAvailability; success: boolean }> {
  //     const url = API_URLS.DRIVER_TODAYS_AVAILABILITY;
  //     const response = await this.httpSvc.get(url, {});
  //     return response.data;
  //   }
  async addFeedback(feedback: IFeedbackPayload): Promise<IFeedback> {
    const url = API_URLS.FEEDBACK;
    const response = await this.httpSvc.post(url, feedback);
    return response.data.data;
  }

  async getFeedbackByDriver(driverId: string): Promise<IFeedback[]> {
    const url = `${API_URLS.FEEDBACK}/driver/${driverId}`;
    const response = await this.httpSvc.get(url);
    return response.data.data;
  }

  async getFeedbackByTrip(tripId: string): Promise<IFeedback> {
    const url = `${API_URLS.FEEDBACK}/trip/${tripId}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async updateFeedback(id: string, payload: Partial<IFeedbackPayload>): Promise<IFeedback> {
    const url = `${API_URLS.FEEDBACK}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data.data;
  }
}
