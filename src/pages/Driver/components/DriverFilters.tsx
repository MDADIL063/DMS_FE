import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormikErrors } from "formik";
import { ActivityStatus } from "../../../data/app.constant";

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
  values: any;
}

const DriverFilters = ({ values, setFieldValue }: IProps) => {
  return (
    <div className="row">
      <div className="col-md-12 col-12">
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
      <div className="col-12 text-end mt-2">
        <Button
          color="inherit"
          disabled={!values.status}
          onClick={async () => {
            setFieldValue("status", "");
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

export default DriverFilters;
