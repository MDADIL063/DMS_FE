import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DailyExpenseStatus, DateFormats, InternalStatusTypes, UserRoles } from "../../data/app.constant";
import { IDailyExpense } from "../../interfaces/daily-expense.interface";
import { IUser } from "../../interfaces/user.interface";
import { useAppSelector } from "../../redux/hooks";
import { AppNotificationService } from "../../services/app-notification.service";
import { DailyExpenseService } from "../../services/daily-expense.service";
import { UtilService } from "../../services/util.service";
import BackButton from "../../shared/components/BackButton";
import ActivateDeactivateStatus from "../../shared/components/Common/ActivateDeactivateStatus";
import ActivityStatusChip from "../../shared/components/Common/ActivityStatusChip";
import Currency from "../../shared/components/Common/Currency";
import ExternalLink from "../../shared/components/Common/ExternalLink";

const DailyExpenseDetails = () => {
  const [dailyExpense, setDailyExpense] = useState<IDailyExpense | null>(null);
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const dailyExpenseSvc = new DailyExpenseService();
  const utilSvc = new UtilService();

  useEffect(() => {
    loadDailyExpense();
  }, []);

  const loadDailyExpense = async () => {
    try {
      const response = await dailyExpenseSvc.getSingleDailyExpense(id as string);
      setDailyExpense(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const updateStatus = async () => {
    try {
      const payload = {
        status: dailyExpense?.status === DailyExpenseStatus.PENDING ? DailyExpenseStatus.APPROVED : DailyExpenseStatus.PENDING,
      };
      await dailyExpenseSvc.updateDailyExpenseStatus(id as string, payload);
      loadDailyExpense();
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-4">
          <BackButton />
        </div>
        <div className="col-8 text-end">
          {dailyExpense?.status === DailyExpenseStatus.PENDING ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CreateTwoToneIcon />}
              onClick={() => navigate(`/daily-expenses/${id}/edit`)}
            >
              Edit Daily Expense
            </Button>
          ) : null}
        </div>
      </div>
      <Card>
        <CardHeader
          title="Daily Expense Details"
          className="card-heading"
          action={
            dailyExpense && loggedInUser.role === UserRoles.ADMIN ? (
              <ActivateDeactivateStatus
                user={dailyExpense}
                moduleTextName="Daily Expense"
                statusType={InternalStatusTypes.DAILY_EXPENSE_STATUS}
                onClick={updateStatus}
              />
            ) : null
          }
        />
        <Divider />
        {dailyExpense?._id ? (
          <CardContent>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Date</p>
                <p className="detail-value">{utilSvc.formatDate(dailyExpense.date)}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Status</p>
                <p className="detail-value">
                  <ActivityStatusChip info={dailyExpense} verient="filled" statusType={InternalStatusTypes.DAILY_EXPENSE_STATUS} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Vehicle</p>
                <p className="detail-value">
                  {dailyExpense.vehicle ? (
                    <>
                      {loggedInUser.role === UserRoles.ADMIN ? (
                        <ExternalLink path={`/vehicles/${dailyExpense.vehicle?._id}`} text={dailyExpense.vehicle?.vehicleNumber} />
                      ) : (
                        <>{dailyExpense.vehicle?.vehicleNumber}</>
                      )}
                    </>
                  ) : null}
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Expense On Fuel</p>
                <p className="detail-value">
                  <Currency value={dailyExpense.expenseOnFuel} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Challan</p>
                <p className="detail-value">
                  <Currency value={dailyExpense.challan} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Other Expenses</p>
                <p className="detail-value">
                  <Currency value={dailyExpense.otherExpenses} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Total Expense</p>
                <p className="detail-value text-danger fw-bold">
                  <Currency value={(dailyExpense.expenseOnFuel || 0) + (dailyExpense.challan || 0) + (dailyExpense.otherExpenses || 0)} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Created By</p>
                <p className="detail-value">{dailyExpense.createdBy.name}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Updated By</p>
                <p className="detail-value">{dailyExpense.updatedBy.name}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Created On</p>
                <p className="detail-value">{utilSvc.formatDate(dailyExpense.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Updated On</p>
                <p className="detail-value">{utilSvc.formatDate(dailyExpense.updatedAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
              </div>
              <div className="col-12 mb-4">
                <p className="detail-label">Remark</p>
                <p className="detail-value">{dailyExpense.remark}</p>
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
};

export default DailyExpenseDetails;
