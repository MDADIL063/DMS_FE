import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import { Button } from "@mui/material";
import { ActivityStatus, DailyExpenseStatus, InternalStatusTypes } from "../../../data/app.constant";
import { IUser } from "../../../interfaces/user.interface";
import BootstrapTooltip from "../Styled/BootstrapTooltip";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import { IDailyExpense } from "../../../interfaces/daily-expense.interface";
import PendingActionsTwoToneIcon from "@mui/icons-material/PendingActionsTwoTone";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";

interface IProps {
  user: IUser | IVehicle | IDailyExpense;
  moduleTextName: string;
  statusType?: `${InternalStatusTypes}`;
  onClick: () => void;
}

const ActivateDeactivateStatus = ({ user, moduleTextName, statusType = InternalStatusTypes.ACTIVITY_STATUS, onClick }: IProps) => {
  return (
    <>
      {statusType === InternalStatusTypes.ACTIVITY_STATUS ? (
        <>
          {user?.status === ActivityStatus.ACTIVE ? (
            <BootstrapTooltip title={`Deactivate ${moduleTextName}`}>
              <Button variant="outlined" color="error" onClick={onClick}>
                <BlockTwoToneIcon className="me-2" /> Deactivate
              </Button>
            </BootstrapTooltip>
          ) : (
            <BootstrapTooltip title={`Activate ${moduleTextName}`}>
              <Button variant="outlined" color="success" onClick={onClick}>
                <DoneTwoToneIcon className="me-2" /> Activate
              </Button>
            </BootstrapTooltip>
          )}
        </>
      ) : (
        <>
          {statusType === InternalStatusTypes.DAILY_EXPENSE_STATUS ? (
            <>
              {user?.status === DailyExpenseStatus.APPROVED ? (
                <BootstrapTooltip title={`Mark As Pending`}>
                  <Button variant="outlined" color="warning" onClick={onClick}>
                    <PendingActionsTwoToneIcon className="me-2" /> Mark Pending
                  </Button>
                </BootstrapTooltip>
              ) : (
                <BootstrapTooltip title={`Mark As Approved`}>
                  <Button variant="outlined" color="success" onClick={onClick}>
                    <InventoryTwoToneIcon className="me-2" /> Mark Approve
                  </Button>
                </BootstrapTooltip>
              )}
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default ActivateDeactivateStatus;
