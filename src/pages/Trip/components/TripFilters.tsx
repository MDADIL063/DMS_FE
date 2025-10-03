import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormikErrors } from "formik";
import { ActivityStatus } from "../../../data/app.constant";
import { ITripFilters } from "../../../interfaces/filter.interface";

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
  values: ITripFilters;
}

const TripFilters = ({ values, setFieldValue }: IProps) => {
  return (
    <div className="row">
      {/* Status Filter */}
      <div className="col-md-4 col-12 mb-2">
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            fullWidth
            name="status"
            value={values.status || ""}
            label="Status"
            onChange={async (e) => {
              await setFieldValue("status", e.target.value);
              await setFieldValue("page", 0);
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* From Date Filter */}
      <div className="col-md-4 col-12 mb-2">
        {/* <TextField
          fullWidth
          size="small"
          label="From Date"
          type="date"
          value={values.fromDate || ""}
          onChange={async (e) => {
            await setFieldValue("fromDate", e.target.value);
            await setFieldValue("page", 0);
          }}
          InputLabelProps={{ shrink: true }}
        /> */}
      </div>

      {/* To Date Filter */}
      <div className="col-md-4 col-12 mb-2">
        {/* <TextField
          fullWidth
          size="small"
          label="To Date"
          type="date"
          value={values.toDate || ""}
          onChange={async (e) => {
            await setFieldValue("toDate", e.target.value);
            await setFieldValue("page", 0);
          }}
          InputLabelProps={{ shrink: true }}
        /> */}
      </div>

      {/* Reset Filters */}
      {/* <div className="col-12 text-end mt-2">
        <Button
          color="inherit"
          disabled={!values.status && !values.fromDate && !values.toDate}
          onClick={async () => {
            await setFieldValue("status", "");
            await setFieldValue("fromDate", "");
            await setFieldValue("toDate", "");
            await setFieldValue("page", 0);
          }}
        >
          <i>Reset Filters</i>
        </Button>
      </div> */}
    </div>
  );
};

export default TripFilters;
