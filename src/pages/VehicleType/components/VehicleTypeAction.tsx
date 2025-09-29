import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { AppMessages } from "../../../data/app.constant";
import { IVehicleType } from "../../../interfaces/vehicle-type.interface";
import BootstrapTooltip from "../../../shared/components/Styled/BootstrapTooltip";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import AddEditVehicleType from "./AddEditVehicleType";

interface IProps {
  vehicleType: IVehicleType;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

const  VehicleTypeAction = ({ vehicleType, onUpdate, onDelete }: IProps) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);

  const onConfirmDialogClose = (result: boolean) => {
    setShowConfirm(false);
    if (result) {
      onDelete(vehicleType._id as string);
    }
  };

  return (
    <>
      <BootstrapTooltip title="Edit">
        <IconButton color="primary" onClick={() => setShowEditDialog(true)}>
          <CreateTwoToneIcon />
        </IconButton>
      </BootstrapTooltip>
      <BootstrapTooltip title="Delete">
        <IconButton color="error" onClick={() => setShowConfirm(true)}>
          <DeleteTwoToneIcon />
        </IconButton>
      </BootstrapTooltip>
      {showConfirm ? <ConfirmDialog message={AppMessages.VEHICLE_TYPE_DELETE_CONFIRM} onClose={onConfirmDialogClose} /> : null}
      {showEditDialog ? (
        <AddEditVehicleType
          vehicleType={vehicleType}
          onCancel={() => setShowEditDialog(false)}
          onAddUpdate={() => {
            setShowEditDialog(false);
            onUpdate();
          }}
        />
      ) : null}
    </>
  );
};

export default VehicleTypeAction;
