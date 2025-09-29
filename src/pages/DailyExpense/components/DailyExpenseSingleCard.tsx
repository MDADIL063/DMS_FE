import { useEffect, useState } from "react";
import { AppDefaults, AppMessages, DailyExpenseStatus, InternalStatusTypes, UserRoles } from "../../../data/app.constant";
import { MaterialColorsCode100 } from "../../../data/color.constant";
import { IDailyExpense } from "../../../interfaces/daily-expense.interface";
import { IUser } from "../../../interfaces/user.interface";
import { useAppSelector } from "../../../redux/hooks";
import { UtilService } from "../../../services/util.service";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";
import Currency from "../../../shared/components/Common/Currency";
import ExternalLink from "../../../shared/components/Common/ExternalLink";
import MenuActionsBtn from "../../../shared/components/Common/MenuActionsBtn";
import GridItem from "../../../shared/components/Styled/GridItem";

interface IProps {
  dailyExpense: IDailyExpense;
  onDelete: (id: string) => void;
}

const DailyExpenseSingleCard = ({ dailyExpense, onDelete }: IProps) => {
  const utilSvc = new UtilService();
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);

  useEffect(() => {
    setBackgroundColor(MaterialColorsCode100[new UtilService().getRandomNumber(0, MaterialColorsCode100.length - 1)]);
  }, []);

  return (
    <GridItem style={{ backgroundColor: AppDefaults.SHOW_MULTI_COLOR_CARDS ? backgroundColor : AppDefaults.DEFAULT_CARD_COLOR }}>
      <div className="row pb-4">
        <div className="col-6 text-start ps-4 mt-4">
          <p className="detail-label">{utilSvc.formatDate(dailyExpense.date)}</p>
        </div>
        <div className="col-4 mt-4">
          <ActivityStatusChip info={dailyExpense} verient="filled" statusType={InternalStatusTypes.DAILY_EXPENSE_STATUS} />
        </div>
        <div className="col-2 mt-3 ps-0">
          <MenuActionsBtn
            info={dailyExpense}
            path="/daily-expenses"
            deleteConfirmMsg={AppMessages.DAILY_EXPENSE_DELETE_CONFIRM}
            onDelete={onDelete}
            hideEditBtn={dailyExpense.status === DailyExpenseStatus.APPROVED}
            hideDeleteBtn={dailyExpense.status === DailyExpenseStatus.APPROVED && loggedInUser.role === UserRoles.DRIVER}
          />
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Total Expense</p>
          <p className="card-detail-value text-danger fw-bold">
            <Currency value={(dailyExpense.expenseOnFuel || 0) + (dailyExpense.challan || 0) + (dailyExpense.otherExpenses || 0)} />
          </p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Vehicle</p>
          <p className="card-detail-value">
            {dailyExpense.vehicle ? (
              <>
                {loggedInUser.role === UserRoles.ADMIN ? (
                  <ExternalLink path={`/vehicles/${dailyExpense.vehicle?._id}`} text={dailyExpense.vehicle?.vehicleNumber} />
                ) : (
                  <>{dailyExpense.vehicle?.vehicleNumber}</>
                )}
              </>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Created By</p>
          <p className="card-detail-value">{dailyExpense.createdBy.name}</p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Created On</p>
          <p className="card-detail-value">{utilSvc.formatDate(dailyExpense.createdAt)}</p>
        </div>
      </div>
    </GridItem>
  );
};

export default DailyExpenseSingleCard;
