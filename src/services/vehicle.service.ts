import { API_URLS } from "../data/app.constant";
import { IVehicleFilters } from "../interfaces/filter.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IVehicle } from "../interfaces/vehicle.interface";
import { HttpService } from "./http.service";
import { UtilService } from "./util.service";

export class VehicleService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async getVehicles(filters: IVehicleFilters): Promise<IListResponse> {
    const response = await this.httpSvc.get(API_URLS.VEHICLES, {
      params: this.utilSvc.getParams(filters),
    });
    return response.data;
  }

  async getSingleVehicle(id: string): Promise<IVehicle> {
    const url = `${API_URLS.VEHICLES}/${id}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async updateVehicleStatus(id: string, payload: { status: string }): Promise<IVehicle> {
    const url = `${API_URLS.VEHICLES}/${id}/status`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async addVehicle(payload: FormData): Promise<IVehicle> {
    const response = await this.httpSvc.post(API_URLS.VEHICLES, payload);
    return response.data;
  }

  async updateVehicle(id: string, payload: FormData): Promise<IVehicle> {
    const url = `${API_URLS.VEHICLES}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async deleteVehicle(id: string): Promise<IVehicle> {
    const url = `${API_URLS.VEHICLES}/${id}`;
    const response = await this.httpSvc.delete(url);
    return response.data;
  }

  async deleteVehicleImage(id: string, imageId: string): Promise<IVehicle> {
    const url = `${API_URLS.VEHICLES}/${id}/images/${imageId}`;
    const response = await this.httpSvc.delete(url);
    return response.data;
  }
}
