import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormikErrors } from "formik";
import { ActivityStatus } from "../../../data/app.constant";
import { IVehicleType } from "../../../interfaces/vehicle-type.interface";

interface IProps {
  vehicleTypes: IVehicleType[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
  values: any;
}

const VehicleFilters = ({ vehicleTypes, values, setFieldValue }: IProps) => {
  return (
    <div className="row">
      <div className="col-md-6 col-6">
        <FormControl fullWidth size="small">
          <InputLabel id="demo-select-small-label">Status</InputLabel>
          <Select
            name="status"
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={values.status}
            label="Status"
            onChange={async (e) => {
              setFieldValue("status", e.target.value);
              await setFieldValue("page", 0);
              await setFieldValue("limit", values.limit);
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value={ActivityStatus.ACTIVE}>{ActivityStatus.ACTIVE}</MenuItem>
            <MenuItem value={ActivityStatus.INACTIVE}>{ActivityStatus.INACTIVE}</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="col-md-6 col-6">
        <FormControl fullWidth size="small">
          <InputLabel id="demo-select-small-label">Vehicle Type</InputLabel>
          <Select
            name="vehicleType"
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={values.vehicleType}
            label="Vehicle Type"
            onChange={async (e) => {
              setFieldValue("vehicleType", e.target.value);
              await setFieldValue("page", 0);
              await setFieldValue("limit", values.limit);
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {vehicleTypes.map((vehicleType) => (
              <MenuItem key={vehicleType._id} value={vehicleType._id}>
                {vehicleType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="col-12 text-end mt-2">
        <Button
          color="inherit"
          disabled={!values.status && !values.vehicleType}
          onClick={async () => {
            setFieldValue("status", "");
            setFieldValue("vehicleType", "");
            await setFieldValue("page", 0);
            await setFieldValue("limit", values.limit);
          }}
        >
          <i>Reset Filters</i>
        </Button>
      </div>
    </div>
  );
};

export default VehicleFilters;
