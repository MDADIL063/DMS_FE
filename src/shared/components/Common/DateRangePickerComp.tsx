import { useEffect, useState } from "react";
import { DateRangePicker, DateRange } from "mui-daterange-picker";
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import InsertInvitationTwoToneIcon from "@mui/icons-material/InsertInvitationTwoTone";
import { UtilService } from "../../../services/util.service";
import { FormikErrors } from "formik";
import { createPortal } from "react-dom";

interface IProps {
  values: any;
  maxDate?: string | Date | undefined;
  minDate?: string | Date | undefined;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
}

const DateRangePickerComp = ({ values, maxDate = undefined, minDate = undefined, setFieldValue }: IProps) => {
  const utilSvc = new UtilService();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: values?.fromDate ? new Date(values?.fromDate) : undefined,
    endDate: values?.toDate ? new Date(values?.toDate) : undefined,
  });

  useEffect(() => {
    setDateRange({
      startDate: values?.fromDate ? new Date(values?.fromDate) : undefined,
      endDate: values?.toDate ? new Date(values?.toDate) : undefined,
    });
  }, [values]);

  const toggleDatePiker = () => setOpen(!open);

  const getFormattedDateRange = (): string =>
    dateRange.startDate && dateRange.endDate ? `${utilSvc.formatDate(dateRange.startDate)} - ${utilSvc.formatDate(dateRange.endDate)}` : "";

  const dateRangeChange = async (range: DateRange) => {
    toggleDatePiker();
    setDateRange(range);
    await setFieldValue("fromDate", range.startDate);
    await setFieldValue("toDate", range.endDate);
  };

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <InputLabel size="small" htmlFor="outlined-adornment-search">
          Date Range
        </InputLabel>
        <OutlinedInput
          size="small"
          id="outlined-adornment-search"
          type="text"
          label="Date Range"
          value={getFormattedDateRange()}
          fullWidth
          readOnly
          endAdornment={
            <InputAdornment position="end">
              <InsertInvitationTwoToneIcon onClick={toggleDatePiker} className="curson-pointer" />
            </InputAdornment>
          }
        />
      </FormControl>
      <div id="target-portal-div"></div>
      {open ? (
        <>
          {createPortal(
            <>
              <DateRangePicker
                wrapperClassName="date-range-picker"
                open={open}
                initialDateRange={dateRange}
                minDate={minDate || new Date(1)}
                maxDate={maxDate}
                toggle={toggleDatePiker}
                onChange={dateRangeChange}
              />
            </>,
            document.getElementById("target-portal-div") as HTMLElement
          )}{" "}
        </>
      ) : null}
    </>
  );
};

export default DateRangePickerComp;
