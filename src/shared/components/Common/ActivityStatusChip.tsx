import { Chip } from "@mui/material";
import { IUser } from "../../../interfaces/user.interface";
import { ActivityStatus, DailyExpenseStatus, InternalStatusTypes } from "../../../data/app.constant";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import { IDailyExpense } from "../../../interfaces/daily-expense.interface";

interface IProps {
  info: IUser | IVehicle | IDailyExpense;
  verient?: "outlined" | "filled";
  statusType?: `${InternalStatusTypes}`;
}

const ActivityStatusChip = ({ info, verient = "outlined", statusType = InternalStatusTypes.ACTIVITY_STATUS }: IProps) => {
  return (
    <>
      {statusType === InternalStatusTypes.ACTIVITY_STATUS ? (
        <>
          {info.status === ActivityStatus.ACTIVE ? (
            <Chip variant={verient || "outlined"} color="success" size="small" label={info.status} />
          ) : (
            <Chip variant={verient || "outlined"} color="error" size="small" label={info.status} />
          )}
        </>
      ) : (
        <>
          {statusType === InternalStatusTypes.DAILY_EXPENSE_STATUS ? (
            <>
              {info.status === DailyExpenseStatus.APPROVED ? (
                <Chip variant={verient || "outlined"} color="success" size="small" label={info.status} />
              ) : (
                <Chip variant={verient || "outlined"} color="warning" size="small" label={info.status} />
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default ActivityStatusChip;
