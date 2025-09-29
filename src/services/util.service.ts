import moment from "moment";
import XLSX from "xlsx-js-style";
import { CurrencyCode, DateFormats, DateRangeDurationTypes } from "../data/app.constant";
import { IAddress, IGeoAddress } from "../interfaces/address.interface";
import { IDailyExpense, IDailyExpenseAnalytics } from "../interfaces/daily-expense.interface";

export class UtilService {
  convertBase64ToBlob(base64Image: string) {
    // Split into two parts
    const parts = base64Image.split(";base64,");

    // Hold the content type
    const imageType = parts[0].split(":")[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }

  convertFileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  }

  formatDate(date: string | Date, format: string = DateFormats.DD_MM_YYYY): string {
    if (!date) {
      return "";
    }
    return moment(date).format(format);
  }

  getParams(filters: any = {}) {
    const params: any = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });
    return params;
  }

  exportAsExcel(data: any[], fileName: string) {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "sheet");

    fileName = `${fileName}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  getRandomNumber(min = 0, max = 100) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  getDailyExpenseAnalyticsData(dailyExpenses: IDailyExpense[]): IDailyExpenseAnalytics {
    const cardsData = {
      expenseOnFuel: 0,
      challan: 0,
      otherExpenses: 0,
      total: 0,
    };

    const perMonthExpenseChartData: any = {
      expenseOnFuel: { labels: [], data: [] },
      challan: { labels: [], data: [] },
      otherExpenses: { labels: [], data: [] },
      total: { labels: [], data: [] },
    };

    const perMonthExpenseListData: any[] = [];
    const sumData: any = {
      expenseOnFuel: {},
      challan: {},
      otherExpenses: {},
      total: {},
    };

    dailyExpenses.forEach((dailyExpense) => {
      const { expenseOnFuel = 0, challan = 0, otherExpenses = 0 } = dailyExpense;
      const total = expenseOnFuel + challan + otherExpenses;

      cardsData.expenseOnFuel += expenseOnFuel;
      cardsData.challan += challan;
      cardsData.otherExpenses += otherExpenses;
      cardsData.total += total;

      const formattedDate = this.formatDate(dailyExpense.date, DateFormats.MMM_YYYY);

      sumData.expenseOnFuel[formattedDate] = (sumData.expenseOnFuel[formattedDate] || 0) + expenseOnFuel;
      sumData.challan[formattedDate] = (sumData.challan[formattedDate] || 0) + challan;
      sumData.otherExpenses[formattedDate] = (sumData.otherExpenses[formattedDate] || 0) + otherExpenses;
      sumData.total[formattedDate] = (sumData.total[formattedDate] || 0) + total;
    });

    Object.keys(sumData).forEach((key) => {
      Object.keys(sumData[key]).forEach((month) => {
        perMonthExpenseChartData[key].data.unshift(sumData[key][month] || 0);
        perMonthExpenseChartData[key].labels.unshift(month);
      });
    });

    Object.keys(sumData.total).forEach((month) => {
      perMonthExpenseListData.unshift({
        month,
        expenseOnFuel: sumData.expenseOnFuel[month] || 0,
        challan: sumData.challan[month] || 0,
        otherExpenses: sumData.otherExpenses[month] || 0,
        total: sumData.total[month] || 0,
      });
    });

    const createPercentageArray = (data: number[], total: number): number[] => {
      const percentages = data.map((d) => parseFloat(this.calculatePercentage(d, total))).filter((value) => !isNaN(value));
      return percentages.length ? (percentages.length === 1 ? [0, ...percentages] : percentages) : [0, 0];
    };

    const cardsChartData = {
      expenseOnFuel: createPercentageArray(perMonthExpenseChartData.expenseOnFuel.data, cardsData.expenseOnFuel),
      challan: createPercentageArray(perMonthExpenseChartData.challan.data, cardsData.challan),
      otherExpenses: createPercentageArray(perMonthExpenseChartData.otherExpenses.data, cardsData.otherExpenses),
      total: createPercentageArray(perMonthExpenseChartData.total.data, cardsData.total),
    };

    return {
      cardsData,
      cardsChartData,
      perMonthExpenseChartData,
      perMonthExpenseListData,
    };
  }

  formatCurrency(value?: number | null, currencyCode = CurrencyCode.INDIA): string {
    if (!value) {
      return "0";
    }
    const formatter = new Intl.NumberFormat(currencyCode, { maximumSignificantDigits: 3 });
    return formatter.format(value);
  }

  calculatePercentage(partialValue: number | null, totalValue: number | null): string {
    if (!partialValue || !totalValue) {
      return "0";
    }
    return ((100 * (partialValue || 0)) / (totalValue || 0)).toFixed(2);
  }

  calculateValueFromPercentage(percentage: number | null, totalValue: number | null): string {
    if (!percentage || !totalValue) {
      return "0";
    }
    return ((percentage * (totalValue || 0)) / 100).toFixed(0);
  }

  getDateRangeStartDate(selectedRange: `${DateRangeDurationTypes}`): Date {
    const today = new Date();
    switch (selectedRange) {
      case DateRangeDurationTypes.THIS_YEAR:
        return new Date(today.getFullYear(), 0, 1);
      case DateRangeDurationTypes.THIS_MONTH:
        return new Date(today.getFullYear(), today.getMonth(), 1);
      case DateRangeDurationTypes.LAST_1_MONTH:
        return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      case DateRangeDurationTypes.LAST_3_MONTHS:
        return new Date(today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
      case DateRangeDurationTypes.LAST_6_MONTHS:
        return new Date(today.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      case DateRangeDurationTypes.LAST_1_YEAR:
        return new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return today;
    }
  }

  isSelectedDateRangeFromChip(values: any, selectedRange: `${DateRangeDurationTypes}`): boolean {
    if (!values.fromDate || !values.toDate) {
      return false;
    }

    const fromDate = this.getDateRangeStartDate(selectedRange).toISOString().split("T")[0];
    const toDate = new Date().toISOString().split("T")[0];

    const fromDateValue = new Date(values.fromDate).toISOString().split("T")[0];
    const toDateValue = new Date(values.toDate).toISOString().split("T")[0];

    if (fromDate === fromDateValue && toDate === toDateValue) {
      return true;
    }

    return false;
  }

  getFullAddress(address: IAddress | IGeoAddress) {
    if (!address) {
      return "";
    }
    let fullAddress: string[] = [];
    if (address.flatNo) {
      fullAddress.push(address.flatNo);
    }
    if (address.streetName) {
      fullAddress.push(address.streetName);
    }
    if (address.area) {
      fullAddress.push(address.area);
    }
    if (address.city) {
      fullAddress.push(address.city);
    }
    if (address.state) {
      fullAddress.push(address.state);
    }
    if (address.pincode) {
      fullAddress.push(`${address.pincode}`);
    }
    return fullAddress.join(", ") || "";
  }
}
