import moment from "moment";
import { API_URLS } from "../data/app.constant";
import { IDailyExpense } from "../interfaces/daily-expense.interface";
import { IDailyExpenseFilters } from "../interfaces/filter.interface";
import { IListResponse } from "../interfaces/response.interface";
import { HttpService } from "./http.service";
import { UtilService } from "./util.service";

export class DailyExpenseService {
  private httpSvc = new HttpService();
  private utilSvc = new UtilService();

  async getDailyExpenses(filters: IDailyExpenseFilters): Promise<IListResponse> {
    filters.fromDate = filters.fromDate ? moment(filters.fromDate).startOf("day").toDate().toString() : undefined;
    filters.toDate = filters.toDate ? moment(filters.toDate).endOf("day").toDate().toString() : undefined;
    const response = await this.httpSvc.get(API_URLS.DAILY_EXPENSE, {
      params: this.utilSvc.getParams(filters),
    });
    return response.data;
  }

  async getSingleDailyExpense(id: string): Promise<IDailyExpense> {
    const url = `${API_URLS.DAILY_EXPENSE}/${id}`;
    const response = await this.httpSvc.get(url);
    return response.data;
  }

  async updateDailyExpenseStatus(id: string, payload: { status: string }): Promise<IDailyExpense> {
    const url = `${API_URLS.DAILY_EXPENSE}/${id}/status`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async addDailyExpense(payload: IDailyExpense): Promise<IDailyExpense> {
    const response = await this.httpSvc.post(API_URLS.DAILY_EXPENSE, payload);
    return response.data;
  }

  async updateDailyExpense(id: string, payload: IDailyExpense): Promise<IDailyExpense> {
    const url = `${API_URLS.DAILY_EXPENSE}/${id}`;
    const response = await this.httpSvc.put(url, payload);
    return response.data;
  }

  async deleteDailyExpense(id: string): Promise<IDailyExpense> {
    const url = `${API_URLS.DAILY_EXPENSE}/${id}`;
    const response = await this.httpSvc.delete(url);
    return response.data;
  }
}
