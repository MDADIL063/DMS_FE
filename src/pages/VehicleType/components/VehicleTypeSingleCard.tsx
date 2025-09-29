import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import MoreHorizTwoToneIcon from "@mui/icons-material/MoreHorizTwoTone";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { AppDefaults, AppMessages } from "../../../data/app.constant";
import { MaterialColorsCode100 } from "../../../data/color.constant";
import { IVehicleType } from "../../../interfaces/vehicle-type.interface";
import { UtilService } from "../../../services/util.service";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import BootstrapTooltip from "../../../shared/components/Styled/BootstrapTooltip";
import GridItem from "../../../shared/components/Styled/GridItem";
import AddEditVehicleType from "./AddEditVehicleType";

interface IProps {
  vehicleType: IVehicleType;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

const VehicleTypeSingleCard = ({ vehicleType, onUpdate, onDelete }: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const open = Boolean(anchorEl);
  const utilSvc = new UtilService();

  useEffect(() => {
    setBackgroundColor(MaterialColorsCode100[new UtilService().getRandomNumber(0, MaterialColorsCode100.length - 1)]);
  }, []);

  const menuBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onConfirmDialogClose = (result: boolean) => {
    setShowConfirm(false);
    if (result) {
      onDelete(vehicleType._id as string);
    }
  };

  return (
    <GridItem style={{ backgroundColor: AppDefaults.SHOW_MULTI_COLOR_CARDS ? backgroundColor : AppDefaults.DEFAULT_CARD_COLOR }}>
      <div className="row py-2">
        <div className="col-6 my-2 text-start ps-4">
          <p className="detail-label">{vehicleType.name}</p>
        </div>
        <div className="col-6 text-end">
          <BootstrapTooltip title="Actions">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={menuBtnClick}
            >
              <MoreHorizTwoToneIcon htmlColor="black" />
            </IconButton>
          </BootstrapTooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            id="composition-menu"
            aria-labelledby="composition-button"
            className="card-action-menu"
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setShowEditDialog(true);
              }}
            >
              <CreateTwoToneIcon color="primary" className="me-2" />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setShowConfirm(true);
              }}
            >
              <DeleteTwoToneIcon color="error" className="me-2" /> Delete
            </MenuItem>
          </Menu>
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
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Created On</p>
          <p className="card-detail-value">{utilSvc.formatDate(vehicleType.createdAt)}</p>
        </div>
        <div className="col-6 text-start ps-4 mt-2">
          <p className="card-detail-label">Updated On</p>
          <p className="card-detail-value">{utilSvc.formatDate(vehicleType.updatedAt)}</p>
        </div>
      </div>
    </GridItem>
  );
};

export default VehicleTypeSingleCard;
