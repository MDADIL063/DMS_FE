import { API_URLS } from "../data/app.constant";
import { IAddress } from "../interfaces/address.interface";
import { IAddressFilters } from "../interfaces/filter.interface";
import { IListResponse } from "../interfaces/response.interface";
import { HttpService } from "./http.service";
import { UtilService } from "./util.service";

export class AddressService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async getAddresses(filters: IAddressFilters): Promise<IListResponse> {
    const response = await this.httpSvc.get(API_URLS.ADDRESS, {
      params: this.utilSvc.getParams(filters),
    });
    return response.data;
  }

  async getSingleAddress(id: string): Promise<IAddress> {
    const url = `${API_URLS.ADDRESS}/${id}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async makeAddressPrimary(id: string): Promise<IAddress> {
    const url = `${API_URLS.ADDRESS}/${id}/primary`;
    const response = await this.httpSvc.put(url, {});
    return response.data;
  }

  async addAddress(payload: any): Promise<IAddress> {
    const response = await this.httpSvc.post(API_URLS.ADDRESS, payload);
    return response.data;
  }

  async updateAddress(id: string, payload: any): Promise<IAddress> {
    const url = `${API_URLS.ADDRESS}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async deleteAddress(id: string): Promise<IAddress> {
    const url = `${API_URLS.ADDRESS}/${id}`;
    const response = await this.httpSvc.delete(url);
    return response.data;
  }
}
