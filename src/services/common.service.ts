import { API_URLS } from "../data/app.constant";
import { ISettings } from "../interfaces/settings.interface";
import { HttpService } from "./http.service";

export class CommonService {
  private httpSvc = new HttpService();

  async getSettings(): Promise<ISettings> {
    const response = await this.httpSvc.get(API_URLS.SETTINGS);
    return response.data;
  }

  async addUpdateSettings(payload: { pricePerKM: number }): Promise<ISettings> {
    const response = await this.httpSvc.post(API_URLS.SETTINGS, payload);
    return response.data;
  }
}
