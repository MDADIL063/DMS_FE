import { API_URLS } from "../data/app.constant";
import { IVehicleTypeFilters } from "../interfaces/filter.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import { IVehicleType } from "../interfaces/vehicle-type.interface";
import { HttpService } from "./http.service";
import { UtilService } from "./util.service";

export class VehicleTypeService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async getVehicleTypes(filters: IVehicleTypeFilters): Promise<IListResponse> {
    const response = await this.httpSvc.get(API_URLS.VEHICLE_TYPES, {
      params: this.utilSvc.getParams(filters),
    });
    return response.data;
  }

  async addVehicleType(payload: { name: string }): Promise<IVehicleType> {
    const response = await this.httpSvc.post(API_URLS.VEHICLE_TYPES, payload);
    return response.data;
  }

  async updateVehicleType(id: string, payload: { name: string }): Promise<IVehicleType> {
    const url = `${API_URLS.VEHICLE_TYPES}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async deleteVehicleType(id: string): Promise<IUser> {
    const url = `${API_URLS.VEHICLE_TYPES}/${id}`;
    const response = await this.httpSvc.delete(url);
    return response.data;
  }
}
