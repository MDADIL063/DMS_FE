import { DailyExpenseStatus } from "../data/app.constant";
import { IUser } from "./user.interface";
import { IVehicle } from "./vehicle.interface";

export interface IDailyExpense {
  _id: string;
  vehicle?: IVehicle | null;
  date: Date | string;
  expenseOnFuel?: number;
  challan?: number;
  otherExpenses?: number;
  remark?: string;
  status: `${DailyExpenseStatus}`;
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IDailyExpenseAnalytics {
  cardsData: ICardsData;
  cardsChartData: ICardChartData;
  perMonthExpenseChartData: IPerMonthExpenseChartData;
  perMonthExpenseListData: IPerMonthExpenseListData[];
}

interface ICardsData {
  expenseOnFuel: number;
  challan: number;
  otherExpenses: number;
  total: number;
}

interface IPerMonthExpenseChartData {
  expenseOnFuel: {
    labels: string[];
    data: number[];
  };
  challan: {
    labels: string[];
    data: number[];
  };
  otherExpenses: {
    labels: string[];
    data: number[];
  };
  total: {
    labels: string[];
    data: number[];
  };
}

interface IPerMonthExpenseListData {
  month: string;
  expenseOnFuel: number;
  challan: number;
  otherExpenses: number;
  total: number;
}

interface ICardChartData {
  expenseOnFuel: number[];
  challan: number[];
  otherExpenses: number[];
  total: number[];
}
