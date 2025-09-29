import { AccountType, ActivityStatus, DailyExpenseStatus, SortBy } from "../data/app.constant";

interface CommonFilters {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  sortBy?: `${SortBy}`;
}

export interface ICustomerFilters extends CommonFilters {
  status?: `${ActivityStatus}`;
  accountType?: `${AccountType}`;
}

export interface IDriverFilters extends CommonFilters {
  status?: `${ActivityStatus}`;
  accountType?: `${AccountType}`;
}

export interface IVehicleTypeFilters extends CommonFilters {}

export interface IVehicleFilters extends CommonFilters {
  status?: `${ActivityStatus}`;
  vehicleType?: string;
}

export interface IDailyExpenseFilters extends CommonFilters {
  status?: `${DailyExpenseStatus}`;
  vehicle?: string;
  fromDate?: string;
  toDate?: string;
  createdBy?: string;
}

export interface IAddressFilters extends CommonFilters {}
