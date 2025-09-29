import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import BootstrapDialog from "./Styled/BootstrapDialog";

interface IProps {
  message: string;
  onClose: (result: boolean) => void;
}

const ConfirmDialog = (props: IProps) => {
  return (
    <BootstrapDialog
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      className={"confirm-dialog-wrapper"}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Confirm
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => props.onClose(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{props.message}</DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={() => props.onClose(false)}>
          No
        </Button>
        <Button autoFocus variant="contained" className="submit-btn" onClick={() => props.onClose(true)}>
          Yes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default ConfirmDialog;
