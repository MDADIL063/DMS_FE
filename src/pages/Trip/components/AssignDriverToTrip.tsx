import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import BootstrapDialog from "../../../shared/components/Styled/BootstrapDialog";
import { DriverService } from "../../../services/driver.service";
import { AttendanceService } from "../../../services/attendance.service";
import { AppNotificationService } from "../../../services/app-notification.service";
import { useEffect, useState } from "react";
import { IDriverAvailability } from "../../../interfaces/attendance.interface";
import { useFormik } from "formik";
import { AppMessages } from "../../../data/app.constant";
import * as Yup from "yup";
import { ITrip } from "../../../interfaces/trip.interface";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { TripService } from "../../../services/trip.service";

interface IProps {
  trip: ITrip;
  onClose: (result: boolean) => void;
}

const AssignDriverToTrip = (props: IProps) => {
  const [availableDrivers, setAvailableDrivers] = useState<IDriverAvailability[]>([]);
  const tripSvc = new TripService();
  const attendanceSvc = new AttendanceService();
  const notifySvc = new AppNotificationService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      driver: props.trip?.driver?._id || "",
    },
    validationSchema: Yup.object({
      driver: Yup.string().required(AppMessages.REQUIRED),
    }),
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        await tripSvc.assignDriverToTrip(props.trip._id, values.driver as string);
        notifySvc.showSucces(AppMessages.DRIVER_ASSIGNED);
        props.onClose(true);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    loadAllAvailableDrivers();
  }, []);

  const loadAllAvailableDrivers = async () => {
    try {
      const response = await attendanceSvc.getTodayAvailabilityForAllDrivers();
      setAvailableDrivers(response.data);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <BootstrapDialog
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      className={"vehicle-add-dialog-wrapper"}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Assign Driver
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
      <DialogContent dividers>
        <div className="row">
          <div className="col-12">
            <FormControl fullWidth error={!!errors.driver && !!touched.driver}>
              <InputLabel>Driver</InputLabel>
              <Select name="driver" label="Driver" value={values.driver} onChange={handleChange}>
                <MenuItem value="">
                  <em>Select Driver</em>
                </MenuItem>
                {availableDrivers.map((availableDriver) => (
                  <MenuItem key={availableDriver?.driver?._id} value={availableDriver?.driver._id}>
                    {availableDriver.driver.name || ""}
                  </MenuItem>
                ))}
              </Select>
              {touched.driver && errors.driver && <small className="text-danger mt-1 fs-12">{errors.driver}</small>}
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={() => props.onClose(false)}>
          Cancel
        </Button>
        <Button autoFocus variant="contained" className="submit-btn" type="submit" onClick={() => handleSubmit()}>
          Assign
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default AssignDriverToTrip;
