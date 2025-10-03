import { Chip } from "@mui/material";
import { IUser } from "../../../interfaces/user.interface";
import { ActivityStatus, DailyExpenseStatus, InternalStatusTypes, TripStatus } from "../../../data/app.constant";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import { IDailyExpense } from "../../../interfaces/daily-expense.interface";
import { ITrip } from "../../../interfaces/trip.interface";

interface IProps {
  info: IUser | IVehicle | IDailyExpense | ITrip;
  verient?: "outlined" | "filled";
  statusType?: `${InternalStatusTypes}`;
}

// ✅ Mapping status → color
const STATUS_COLOR_MAP: Record<
  InternalStatusTypes,
  Record<string, "success" | "error" | "warning" | "default" | "info" | "secondary" | "primary">
> = {
  [InternalStatusTypes.ACTIVITY_STATUS]: {
    [ActivityStatus.ACTIVE]: "success",
    [ActivityStatus.INACTIVE]: "error",
  },
  [InternalStatusTypes.DAILY_EXPENSE_STATUS]: {
    [DailyExpenseStatus.APPROVED]: "success",
    [DailyExpenseStatus.PENDING]: "warning",
    // [DailyExpenseStatus.REJECTED]: "error",
  },
  [InternalStatusTypes.TRIP_STATUS]: {
    [TripStatus.NEW]: "info",
    [TripStatus.SCHEDULED]: "warning",
    [TripStatus.INPROGRESS]: "success",
    [TripStatus.COMPLETED]: "success",
    [TripStatus.CANCELLED]: "error",
  },
};

const ActivityStatusChip = ({ info, verient = "outlined", statusType = InternalStatusTypes.ACTIVITY_STATUS }: IProps) => {
  const status = info.status as string;
  const color = STATUS_COLOR_MAP[statusType]?.[status] || "default";

  return <Chip variant={verient} color={color} size="small" label={status} />;
};

export default ActivityStatusChip;
