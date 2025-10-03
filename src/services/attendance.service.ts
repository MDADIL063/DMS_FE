import { API_URLS } from "../data/app.constant";

import { HttpService } from "./http.service";
import { UtilService } from "./util.service";
import { IDriverAvailability } from "../interfaces/attendance.interface";

export class AttendanceService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async driverCheckIn(): Promise<IDriverAvailability> {
    const url = API_URLS.CHECK_IN;
    const response = await this.httpSvc.post(url, {});
    return response.data;
  }

  async driverCheckOut(): Promise<IDriverAvailability> {
    const url = API_URLS.CHECK_OUT; // e.g. "/api/availability/check-out"
    const response = await this.httpSvc.post(url, {});
    return response.data;
  }
  async driverTodaysAvailability(): Promise<{ data: IDriverAvailability; success: boolean }> {
    const url = API_URLS.DRIVER_TODAYS_AVAILABILITY;
    const response = await this.httpSvc.get(url, {});
    return response.data;
  }

  async getTodayAvailabilityForAllDrivers(): Promise<{ data: IDriverAvailability[]; success: boolean }> {
    const url = API_URLS.ALL_DRIVER_TODAYS_AVAILABILITY;
    const response = await this.httpSvc.get(url, {});
    return response.data;
  }
}
