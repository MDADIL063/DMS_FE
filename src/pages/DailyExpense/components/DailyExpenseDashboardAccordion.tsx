import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { FormikErrors } from "formik";
import { IUser } from "../../../interfaces/user.interface";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import DailyExpenseFilters from "./DailyExpenseFilters";

interface IProps {
  vehicles: IVehicle[];
  drivers: IUser[];
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
}

const DailyExpenseDashboardAccordion = ({ vehicles, drivers, values, setFieldValue }: IProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
        <h5>Daily Expenses</h5>
      </AccordionSummary>
      <AccordionDetails>
        <DailyExpenseFilters
          vehicles={vehicles}
          drivers={drivers}
          values={values}
          hideResetBtn={true}
          disableStatus={true}
          showDurationChip={true}
          setFieldValue={setFieldValue}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default DailyExpenseDashboardAccordion;
