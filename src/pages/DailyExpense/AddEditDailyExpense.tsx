import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import { Button, Card, CardContent, CardHeader, FormControl, InputAdornment, MenuItem, OutlinedInput, Select } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppMessages } from "../../data/app.constant";
import { IVehicle } from "../../interfaces/vehicle.interface";
import { addEditDailyExpenseSchema } from "../../schemas/daile-expense.schema";
import { AppNotificationService } from "../../services/app-notification.service";
import { DailyExpenseService } from "../../services/daily-expense.service";
import { VehicleService } from "../../services/vehicle.service";
import BackButton from "../../shared/components/BackButton";

const initialValues = {
  date: "",
  vehicle: "",
  expenseOnFuel: "",
  challan: "",
  otherExpenses: "",
  remark: "",
};

const AddEditDailyExpense = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const dailyExpenseSvc = new DailyExpenseService();
  const vehicleSvc = new VehicleService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: addEditDailyExpenseSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        const payload: any = { ...values };
        payload.date = payload.date ? dayjs(payload.date).toISOString() : "";
        payload.vehicle = payload.vehicle || null;
        if (id) {
          await dailyExpenseSvc.updateDailyExpense(id, payload as any);
          notifySvc.showSucces(AppMessages.DAILY_EXPENSE_UPDATED);
        } else {
          await dailyExpenseSvc.addDailyExpense(payload as any);
          notifySvc.showSucces(AppMessages.DAILY_EXPENSE_ADDED);
        }
        navigate(-1);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    loadVehicles();
    if (id) {
      loadDailyExpense();
    }
  }, []);

  const loadDailyExpense = async () => {
    try {
      const response = await dailyExpenseSvc.getSingleDailyExpense(id as string);
      setFieldValue("date", response.date ? dayjs(response.date) : "");
      setFieldValue("vehicle", response.vehicle?._id || "");
      setFieldValue("expenseOnFuel", response.expenseOnFuel || "");
      setFieldValue("challan", response.challan || "");
      setFieldValue("otherExpenses", response.otherExpenses || "");
      setFieldValue("remark", response.remark || "");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await vehicleSvc.getVehicles({});
      setVehicles(response.data);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader title={id ? "Edit Daily Expense" : "Add Daily Expense"} className="card-heading" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 col-sm-6 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className={errors.date && touched.date ? "datepicker-error" : ""}
                      name="date"
                      label="Date"
                      disableFuture={true}
                      format="DD/MM/YYYY"
                      value={(values.date as any) || null}
                      onChange={(value) => setFieldValue("date", value, true)}
                    />
                  </LocalizationProvider>
                </FormControl>
                {errors.date && touched.date ? (
                  <p className="text-danger text-sm">{errors.date}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-md-4 col-sm-6 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-select-small-label">Vehicle</InputLabel>
                  <Select
                    name="vehicle"
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={values.vehicle}
                    label="Vehicle"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle._id} value={vehicle._id}>
                        {vehicle.vehicleNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.vehicle && touched.vehicle ? (
                  <p className="text-danger text-sm">{errors.vehicle}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-md-4 col-sm-6 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    className={errors.expenseOnFuel && touched.expenseOnFuel ? "text-danger" : ""}
                    htmlFor="outlined-adornment-password"
                  >
                    Expense On Fuel
                  </InputLabel>
                  <OutlinedInput
                    error={errors.expenseOnFuel && touched.expenseOnFuel ? true : undefined}
                    type="number"
                    name="expenseOnFuel"
                    label="Expense On Fuel"
                    value={values.expenseOnFuel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <CurrencyRupeeTwoToneIcon fontSize="small" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.expenseOnFuel && touched.expenseOnFuel ? (
                  <p className="text-danger text-sm">{errors.expenseOnFuel}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-md-4 col-sm-6 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel className={errors.challan && touched.challan ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                    Challan
                  </InputLabel>
                  <OutlinedInput
                    error={errors.challan && touched.challan ? true : undefined}
                    type="number"
                    name="challan"
                    label="Challan"
                    value={values.challan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <CurrencyRupeeTwoToneIcon fontSize="small" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.challan && touched.challan ? (
                  <p className="text-danger text-sm">{errors.challan}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-md-4 col-sm-6 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    className={errors.otherExpenses && touched.otherExpenses ? "text-danger" : ""}
                    htmlFor="outlined-adornment-password"
                  >
                    Other Expenses
                  </InputLabel>
                  <OutlinedInput
                    error={errors.otherExpenses && touched.otherExpenses ? true : undefined}
                    type="number"
                    name="otherExpenses"
                    label="Other Expenses"
                    value={values.otherExpenses}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <CurrencyRupeeTwoToneIcon fontSize="small" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.otherExpenses && touched.otherExpenses ? (
                  <p className="text-danger text-sm">{errors.otherExpenses}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-md-12 col-sm-12 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel className={errors.remark && touched.remark ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                    Remark
                  </InputLabel>
                  <OutlinedInput
                    multiline
                    error={errors.remark && touched.remark ? true : undefined}
                    type="text"
                    name="remark"
                    label="Remark"
                    value={values.remark}
                    rows={3}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                {errors.remark && touched.remark ? (
                  <p className="text-danger text-sm">{errors.remark}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-md-3 col-12"></div>
                  <div className="col-md-3 col-12"></div>
                  <div className="col-md-3 col-12"></div>
                  <div className="col-md-3 col-12 mt-2">
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditDailyExpense;
