import { API_URLS } from "../data/app.constant";
import { IDriverFilters } from "../interfaces/filter.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import { HttpService } from "./http.service";
import { UtilService } from "./util.service";

export class DriverService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async getDrivers(filters: IDriverFilters): Promise<IListResponse> {
    const response = await this.httpSvc.get(API_URLS.DRIVERS, {
      params: this.utilSvc.getParams(filters),
    });
    return response.data;
  }

  async getSingleDriver(id: string): Promise<IUser> {
    const url = `${API_URLS.DRIVERS}/${id}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async updateDriverStatus(id: string, payload: { status: string }): Promise<IUser> {
    const url = `${API_URLS.DRIVERS}/${id}/status`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async addDriver(payload: FormData): Promise<IUser> {
    const response = await this.httpSvc.post(API_URLS.DRIVERS, payload);
    return response.data;
  }

  async updateDriver(id: string, payload: FormData): Promise<IUser> {
    const url = `${API_URLS.DRIVERS}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async deleteDriver(id: string): Promise<IUser> {
    const url = `${API_URLS.DRIVERS}/${id}`;
    const response = await this.httpSvc.delete(url);
    return response.data;
  }
}
