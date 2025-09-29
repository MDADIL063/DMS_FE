import PriceChangeTwoToneIcon from "@mui/icons-material/PriceChangeTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { AppDefaults, DailyExpenseStatus, DateRangeDurationTypes } from "../../data/app.constant";
import { IDailyExpenseAnalytics } from "../../interfaces/daily-expense.interface";
import { IDailyExpenseFilters } from "../../interfaces/filter.interface";
import { IUser } from "../../interfaces/user.interface";
import { IVehicle } from "../../interfaces/vehicle.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { DailyExpenseService } from "../../services/daily-expense.service";
import { DriverService } from "../../services/driver.service";
import { LoaderService } from "../../services/loader.service";
import { UtilService } from "../../services/util.service";
import { VehicleService } from "../../services/vehicle.service";
import DailyExpenseDashboardAccordion from "./components/DailyExpenseDashboardAccordion";
import DailyExpenseDashboardCards from "./components/DailyExpenseDashboardCards";
import PerMonthExpenseChart from "./components/PerMonthExpenseChart";
import PerMonthExpenseList from "./components/PerMonthExpenseList";

const initialValues: any = {
  status: DailyExpenseStatus.APPROVED,
  vehicle: "",
  fromDate: new UtilService().getDateRangeStartDate(DateRangeDurationTypes.THIS_YEAR),
  toDate: new Date(),
  createdBy: "",
  sort: "date",
  sortBy: AppDefaults.SORT_BY,
};

const DailyExpenses = () => {
  const notifySvc = new AppNotificationService();
  const vehicleSvc = new VehicleService();
  const driverSvc = new DriverService();
  const dailyExpenseSvc = new DailyExpenseService();
  const utilSvc = new UtilService();
  const loaderSvc = new LoaderService();
  const [dailyExpenseAnalytics, setDailyExpenseAnalytics] = useState<IDailyExpenseAnalytics | null>(null);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [drivers, setDrivers] = useState<IUser[]>([]);
  const navigate = useNavigate();

  const { values, setFieldValue } = useFormik({
    initialValues,

    onSubmit: (values) => {},

    validate: (values: any) => {
      debounced(values);
      return {};
    },
  });

  const debounced = useDebouncedCallback((formData: IDailyExpenseFilters) => {
    loadDailyExpenses(formData);
  }, 500);

  useEffect(() => {
    loadDailyExpenses(initialValues as IDailyExpenseFilters);
    loadVehicles();
    loadDrivers();
  }, []);

  const loadDailyExpenses = async (filters: IDailyExpenseFilters) => {
    try {
      const response = await dailyExpenseSvc.getDailyExpenses(filters);
      loaderSvc.showLoader();
      const formattedData = utilSvc.getDailyExpenseAnalyticsData(response.data);
      setDailyExpenseAnalytics(formattedData);
    } catch (error) {
      notifySvc.showError(error);
    } finally {
      loaderSvc.hideLoader();
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

  const loadDrivers = async () => {
    try {
      const response = await driverSvc.getDrivers({});
      setDrivers(response.data);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <DailyExpenseDashboardAccordion drivers={drivers} vehicles={vehicles} values={values} setFieldValue={setFieldValue} />
        </div>
      </div>
      {dailyExpenseAnalytics ? (
        <Card>
          <CardHeader
            title={`${utilSvc.formatDate(values.fromDate)} - ${utilSvc.formatDate(values.toDate)}`}
            className="card-heading"
            action={
              <Button variant="outlined" color="primary" onClick={() => navigate("/daily-expenses/list")}>
                <PriceChangeTwoToneIcon fontSize="small" className="me-2" /> Daily Expenses
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <DailyExpenseDashboardCards dailyExpenseAnalytics={dailyExpenseAnalytics} />
            <div className="row mt-4">
              <div className="col-lg-6 col-md-6 col-12 mb-4">
                <PerMonthExpenseList dailyExpenseAnalytics={dailyExpenseAnalytics} />
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <PerMonthExpenseChart dailyExpenseAnalytics={dailyExpenseAnalytics} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default DailyExpenses;
