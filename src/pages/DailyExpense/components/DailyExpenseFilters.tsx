import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Chip from "@mui/material/Chip";
import { FormikErrors } from "formik";
import { DailyExpenseStatus, DateRangeDurationTypes, UserRoles } from "../../../data/app.constant";
import { IUser } from "../../../interfaces/user.interface";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import { useAppSelector } from "../../../redux/hooks";
import { UtilService } from "../../../services/util.service";
import DateRangePickerComp from "../../../shared/components/Common/DateRangePickerComp";

interface IProps {
  vehicles: IVehicle[];
  drivers: IUser[];
  values: any;
  disableStatus?: boolean;
  hideResetBtn?: boolean;
  showDurationChip?: boolean;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
}

const DailyExpenseFilters = ({
  vehicles,
  drivers,
  values,
  disableStatus = false,
  hideResetBtn = false,
  showDurationChip = false,
  setFieldValue,
}: IProps) => {
  const utilSvc = new UtilService();
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);

  const handleDurationChange = async (selectedRange: `${DateRangeDurationTypes}`) => {
    const fromDate: Date = utilSvc.getDateRangeStartDate(selectedRange);
    await setFieldValue("fromDate", fromDate);
    await setFieldValue("toDate", new Date());
  };

  return (
    <div className="row">
      {showDurationChip ? (
        <div className="col-12">
          <Chip
            className="me-2 mb-4"
            color={utilSvc.isSelectedDateRangeFromChip(values, DateRangeDurationTypes.THIS_YEAR) ? "primary" : "default"}
            label={DateRangeDurationTypes.THIS_YEAR}
            onClick={() => {
              handleDurationChange(DateRangeDurationTypes.THIS_YEAR);
            }}
          />
          <Chip
            className="me-2 mb-4"
            color={utilSvc.isSelectedDateRangeFromChip(values, DateRangeDurationTypes.THIS_MONTH) ? "primary" : "default"}
            label={DateRangeDurationTypes.THIS_MONTH}
            onClick={() => {
              handleDurationChange(DateRangeDurationTypes.THIS_MONTH);
            }}
          />
          <Chip
            className="me-2 mb-4"
            color={utilSvc.isSelectedDateRangeFromChip(values, DateRangeDurationTypes.LAST_1_MONTH) ? "primary" : "default"}
            label={DateRangeDurationTypes.LAST_1_MONTH}
            onClick={() => {
              handleDurationChange(DateRangeDurationTypes.LAST_1_MONTH);
            }}
          />
          <Chip
            className="me-2 mb-4"
            color={utilSvc.isSelectedDateRangeFromChip(values, DateRangeDurationTypes.LAST_3_MONTHS) ? "primary" : "default"}
            label={DateRangeDurationTypes.LAST_3_MONTHS}
            onClick={() => {
              handleDurationChange(DateRangeDurationTypes.LAST_3_MONTHS);
            }}
          />
          <Chip
            className="me-2 mb-4"
            color={utilSvc.isSelectedDateRangeFromChip(values, DateRangeDurationTypes.LAST_6_MONTHS) ? "primary" : "default"}
            label={DateRangeDurationTypes.LAST_6_MONTHS}
            onClick={() => {
              handleDurationChange(DateRangeDurationTypes.LAST_6_MONTHS);
            }}
          />
          <Chip
            className="me-2 mb-4"
            color={utilSvc.isSelectedDateRangeFromChip(values, DateRangeDurationTypes.LAST_1_YEAR) ? "primary" : "default"}
            label={DateRangeDurationTypes.LAST_1_YEAR}
            onClick={() => {
              handleDurationChange(DateRangeDurationTypes.LAST_1_YEAR);
            }}
          />
        </div>
      ) : null}

      <div className={`${loggedInUser.role === UserRoles.ADMIN ? "col-lg-3" : "col-lg-4"} col-md-4 col-sm-6 col-12 mb-3`}>
        <DateRangePickerComp values={values} setFieldValue={setFieldValue} maxDate={new Date()} />
      </div>
      <div className={`${loggedInUser.role === UserRoles.ADMIN ? "col-lg-3" : "col-lg-4"} col-md-4 col-sm-6 col-12 mb-3`}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-select-small-label">Status</InputLabel>
          <Select
            name="status"
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={values.status}
            label="Status"
            disabled={disableStatus}
            onChange={async (e) => {
              setFieldValue("status", e.target.value);
              await setFieldValue("page", 0);
              await setFieldValue("limit", values.limit);
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value={DailyExpenseStatus.PENDING}>{DailyExpenseStatus.PENDING}</MenuItem>
            <MenuItem value={DailyExpenseStatus.APPROVED}>{DailyExpenseStatus.APPROVED}</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={`${loggedInUser.role === UserRoles.ADMIN ? "col-lg-3" : "col-lg-4"} col-md-4 col-sm-6 col-12 mb-3`}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-select-small-label">Vehicle</InputLabel>
          <Select
            name="vehicle"
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={values.vehicle}
            label="Vehicle"
            onChange={async (e) => {
              setFieldValue("vehicle", e.target.value);
              await setFieldValue("page", 0);
              await setFieldValue("limit", values.limit);
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle._id} value={vehicle._id}>
                {vehicle.vehicleNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {loggedInUser.role === UserRoles.ADMIN ? (
        <div className={`${loggedInUser.role === UserRoles.ADMIN ? "col-lg-3" : "col-lg-4"} col-md-4 col-sm-6 col-12 mb-3`}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small-label">Driver</InputLabel>
            <Select
              name="createdBy"
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={values.createdBy}
              label="Driver"
              onChange={async (e) => {
                setFieldValue("createdBy", e.target.value);
                await setFieldValue("page", 0);
                await setFieldValue("limit", values.limit);
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver._id} value={driver._id}>
                  {driver.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null}

      {!hideResetBtn ? (
        <div className="col-12 text-end mt-2">
          <Button
            color="inherit"
            disabled={!values.status && !values.vehicle && !values.createdBy && !values.fromDate && !values.toDate}
            onClick={async () => {
              if (!disableStatus) {
                setFieldValue("status", "");
              }
              setFieldValue("vehicle", "");
              setFieldValue("createdBy", "");
              setFieldValue("fromDate", "");
              setFieldValue("toDate", "");
              await setFieldValue("page", 0);
              await setFieldValue("limit", values.limit);
            }}
          >
            <i>Reset Filters</i>
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default DailyExpenseFilters;
