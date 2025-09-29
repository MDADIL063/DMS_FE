import { Card, CardContent, CardHeader } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { AppDefaults } from "../../../data/app.constant";
import { IDailyExpenseAnalytics } from "../../../interfaces/daily-expense.interface";
import { UtilService } from "../../../services/util.service";
import Currency from "../../../shared/components/Common/Currency";
import BootstrapTooltip from "../../../shared/components/Styled/BootstrapTooltip";

const ExpensePercentageTooltipTitle = ({
  perMonthExpense,
  cardsData,
}: {
  perMonthExpense: { total: number };
  cardsData: { total: number };
}) => {
  const percentage = new UtilService().calculatePercentage(perMonthExpense.total, cardsData.total);

  return (
    <>
      {percentage}% of total expenses (<Currency value={cardsData.total} />)
    </>
  );
};

interface IProps {
  dailyExpenseAnalytics: IDailyExpenseAnalytics;
}

const PerMonthExpenseList = ({ dailyExpenseAnalytics }: IProps) => {
  const { cardsData, perMonthExpenseListData } = dailyExpenseAnalytics;

  return (
    <Card style={{ backgroundColor: AppDefaults.DEFAULT_CARD_COLOR }}>
      <CardHeader title="Per Month Expense" className="card-heading" />
      <CardContent>
        <div className="per-month-expense-list">
          {perMonthExpenseListData.length ? (
            <>
              {perMonthExpenseListData.map((perMonthExpense, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={
                      <BootstrapTooltip title={<ExpensePercentageTooltipTitle perMonthExpense={perMonthExpense} cardsData={cardsData} />}>
                        <h6 className="text-danger">
                          <Currency value={perMonthExpense.total} />
                        </h6>
                      </BootstrapTooltip>
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    {perMonthExpense.month}
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="row">
                      <div className="col-md-4 col-3">
                        <p className="card-detail-label">Fuel</p>
                        <p className="card-detail-value">
                          <Currency value={perMonthExpense.expenseOnFuel} />
                        </p>
                      </div>
                      <div className="col-md-4 col-3">
                        <p className="card-detail-label">Challan</p>
                        <p className="card-detail-value">
                          <Currency value={perMonthExpense.challan} />
                        </p>
                      </div>
                      <div className="col-md-4 col-6">
                        <p className="card-detail-label">Other Expenses</p>
                        <p className="card-detail-value">
                          <Currency value={perMonthExpense.otherExpenses} />
                        </p>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          ) : (
            <p className="align-center">No data to display</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerMonthExpenseList;
