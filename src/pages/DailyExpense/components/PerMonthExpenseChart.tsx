import { Card, CardContent, CardHeader } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { AppDefaults } from "../../../data/app.constant";
import { DailyExpenseCardColors } from "../../../data/color.constant";
import { IDailyExpenseAnalytics } from "../../../interfaces/daily-expense.interface";
import { UtilService } from "../../../services/util.service";

interface IProps {
  dailyExpenseAnalytics: IDailyExpenseAnalytics;
}

const PerMonthExpenseChart = ({ dailyExpenseAnalytics }: IProps) => {
  const utilSvc = new UtilService();
  const { expenseOnFuel, challan, otherExpenses, total } = dailyExpenseAnalytics.perMonthExpenseChartData;

  return (
    <Card style={{ backgroundColor: AppDefaults.DEFAULT_CARD_COLOR }}>
      <CardHeader title="Monthly Expense" className="card-heading" />
      <CardContent>
        {total.data.length ? (
          <BarChart
            height={300}
            series={[
              {
                data: expenseOnFuel.data,
                label: "Fuel",
                stack: "stack1",
                color: DailyExpenseCardColors.expenseOnFuel,
                valueFormatter: (value) => `${AppDefaults.RUPEE_SYMBOL}${utilSvc.formatCurrency(value)}`,
              },
              {
                data: challan.data,
                label: "Challan",
                stack: "stack1",
                color: DailyExpenseCardColors.challan,
                valueFormatter: (value) => `${AppDefaults.RUPEE_SYMBOL}${utilSvc.formatCurrency(value)}`,
              },
              {
                data: otherExpenses.data,
                label: "Other Expenses",
                stack: "stack1",
                color: DailyExpenseCardColors.otherExpenses,
                valueFormatter: (value) => `${AppDefaults.RUPEE_SYMBOL}${utilSvc.formatCurrency(value)}`,
              },
            ]}
            xAxis={[{ data: total.labels, scaleType: "band" }]}
          />
        ) : (
          <p className="align-center">No data to display</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PerMonthExpenseChart;
