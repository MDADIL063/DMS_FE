import { API_URLS } from "../data/app.constant";
import { ICustomerFilters } from "../interfaces/filter.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import { HttpService } from "./http.service";
import { UtilService } from "./util.service";

export class CustomerService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async getCustomers(filters: ICustomerFilters): Promise<IListResponse> {
    const response = await this.httpSvc.get(API_URLS.CUSTOMERS, {
      params: this.utilSvc.getParams(filters),
    });
    return response.data;
  }

  async getSingleCustomer(id: string): Promise<IUser> {
    const url = `${API_URLS.CUSTOMERS}/${id}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async updateCustomerStatus(id: string, payload: { status: string }): Promise<IUser> {
    const url = `${API_URLS.CUSTOMERS}/${id}/status`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }
}
