import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import MoreHorizTwoToneIcon from "@mui/icons-material/MoreHorizTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import WhereToVoteTwoToneIcon from "@mui/icons-material/WhereToVoteTwoTone";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppMessages } from "../../../data/app.constant";
import { IAddress } from "../../../interfaces/address.interface";
import { IDailyExpense } from "../../../interfaces/daily-expense.interface";
import { IUser } from "../../../interfaces/user.interface";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import BootstrapTooltip from "../../../shared/components/Styled/BootstrapTooltip";

interface IProps {
  info: IUser | IVehicle | IDailyExpense | IAddress;
  path: string;
  deleteConfirmMsg?: string;
  hideDetailsBtn?: boolean;
  hideEditBtn?: boolean;
  hideDeleteBtn?: boolean;
  showMakePrimaryBtn?: boolean;
  onMakePrimary?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MenuActionsBtn = ({
  info,
  path,
  deleteConfirmMsg = AppMessages.DEFAULT_DELETE_CONFIRM,
  hideDetailsBtn = false,
  hideEditBtn = false,
  hideDeleteBtn = false,
  showMakePrimaryBtn = false,
  onMakePrimary = (id) => {},
  onDelete = (id) => {},
}: IProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const menuBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onConfirmDialogClose = (result: boolean) => {
    setShowConfirm(false);
    if (result) {
      onDelete(info._id as string);
    }
  };

  return (
    <>
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
        {!hideDetailsBtn ? (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate(`${path}/${info._id}`);
            }}
          >
            <VisibilityTwoToneIcon color="secondary" className="me-2" /> Details
          </MenuItem>
        ) : null}
        {!hideEditBtn ? (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate(`${path}/${info._id}/edit`);
            }}
          >
            <CreateTwoToneIcon color="primary" className="me-2" />
            Edit
          </MenuItem>
        ) : null}
        {!hideDeleteBtn ? (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setShowConfirm(true);
            }}
          >
            <DeleteTwoToneIcon color="error" className="me-2" /> Delete
          </MenuItem>
        ) : null}
        {showMakePrimaryBtn ? (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setTimeout(() => {
                onMakePrimary(info._id as string);
              }, 500);
            }}
          >
            <WhereToVoteTwoToneIcon color="success" className="me-2" /> Make Primary
          </MenuItem>
        ) : null}
      </Menu>
      {showConfirm ? <ConfirmDialog message={deleteConfirmMsg} onClose={onConfirmDialogClose} /> : null}
    </>
  );
};

export default MenuActionsBtn;
