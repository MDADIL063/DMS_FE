import CloseIcon from "@mui/icons-material/Close";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useFormik } from "formik";
import { useEffect } from "react";
import { AppMessages } from "../../../data/app.constant";
import { IVehicleType } from "../../../interfaces/vehicle-type.interface";
import { AddEditVehicleTypeSchema } from "../../../schemas/vehicle-type.schema";
import { AppNotificationService } from "../../../services/app-notification.service";
import { VehicleTypeService } from "../../../services/vehicle-type.service";
import BootstrapDialog from "../../../shared/components/Styled/BootstrapDialog";

interface IProps {
  vehicleType?: IVehicleType;
  onAddUpdate: () => void;
  onCancel: () => void;
}

const initialValues = {
  name: "",
};

const AddEditVehicleType = ({ vehicleType, onAddUpdate, onCancel }: IProps) => {
  const notifySvc = new AppNotificationService();
  const vehicleTypeSvc = new VehicleTypeService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: AddEditVehicleTypeSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        if (vehicleType?._id) {
          await vehicleTypeSvc.updateVehicleType(vehicleType._id, values);
          notifySvc.showSucces(AppMessages.VEHICLE_TYPE_UPDATED);
        } else {
          await vehicleTypeSvc.addVehicleType(values);
          notifySvc.showSucces(AppMessages.VEHICLE_TYPE_ADDED);
        }
        onAddUpdate();
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    if (vehicleType?._id) {
      setFieldValue("name", vehicleType.name);
    }
  }, []);

  return (
    <BootstrapDialog
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      className={"vehicle-add-dialog-wrapper"}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {vehicleType?._id ? "Edit Vehicle Type" : "Add Vehicle Type"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => onCancel()}
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
              <FormControl variant="outlined" fullWidth>
                <InputLabel className={errors.name && touched.name ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                  Name
                </InputLabel>
                <OutlinedInput
                  error={errors.name && touched.name ? true : undefined}
                  type="text"
                  name="name"
                  label="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormControl>
              {errors.name && touched.name ? (
                <p className="text-danger text-sm">{errors.name}</p>
              ) : (
                <p className="text-danger text-sm invisible">&nbsp;</p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button autoFocus variant="contained" className="submit-btn" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

export default AddEditVehicleType;
