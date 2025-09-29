import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import FilterListTwoToneIcon from "@mui/icons-material/FilterListTwoTone";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import WindowTwoToneIcon from "@mui/icons-material/WindowTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { AppDefaults, AppMessages, DateFormats, SortBy, UserRoles } from "../../data/app.constant";
import { IDailyExpense } from "../../interfaces/daily-expense.interface";
import { IDailyExpenseFilters } from "../../interfaces/filter.interface";
import { IListResponse } from "../../interfaces/response.interface";
import { IUser } from "../../interfaces/user.interface";
import { IVehicle } from "../../interfaces/vehicle.interface";
import { useAppSelector } from "../../redux/hooks";
import { AppNotificationService } from "../../services/app-notification.service";
import { DailyExpenseService } from "../../services/daily-expense.service";
import { DriverService } from "../../services/driver.service";
import { UtilService } from "../../services/util.service";
import { VehicleService } from "../../services/vehicle.service";
import BackButton from "../../shared/components/BackButton";
import SearchBox from "../../shared/components/Common/SearchBox";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";
import DailyExpenseCards from "./components/DailyExpenseCards";
import DailyExpenseFilters from "./components/DailyExpenseFilters";
import DailyExpenseList from "./components/DailyExpenseList";

const initialValues: any = {
  q: "",
  status: "",
  vehicle: "",
  fromDate: "",
  toDate: "",
  createdBy: "",
  page: AppDefaults.PAGE_NO,
  limit: AppDefaults.PAGE_LIMIT,
  sort: AppDefaults.SORT,
  sortBy: AppDefaults.SORT_BY,
};

const DailyExpensesListCardView = () => {
  const notifySvc = new AppNotificationService();
  const vehicleSvc = new VehicleService();
  const driverSvc = new DriverService();
  const dailyExpenseSvc = new DailyExpenseService();
  const utilSvc = new UtilService();
  const navigate = useNavigate();
  const [dailyExpenses, setDailyExpenses] = useState<IListResponse>({
    total: 0,
    data: [],
  });
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [drivers, setDrivers] = useState<IUser[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showListView, setShowListView] = useState<boolean>(!utilSvc.isMobile());
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);

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
    if (loggedInUser.role === UserRoles.ADMIN) {
      loadDrivers();
    }
  }, []);

  const loadDailyExpenses = async (filters: IDailyExpenseFilters) => {
    try {
      filters = { ...filters, page: (filters.page || 0) + 1 };
      const response = await dailyExpenseSvc.getDailyExpenses(filters);
      setDailyExpenses(response);
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

  const loadDrivers = async () => {
    try {
      const response = await driverSvc.getDrivers({});
      setDrivers(response.data);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const exportDailyExpenses = async () => {
    try {
      const response = await dailyExpenseSvc.getDailyExpenses({
        q: values.q,
        status: values.status,
        vehicle: values.vehicle,
        fromDate: values.fromDate,
        toDate: values.toDate,
        createdBy: values.createdBy,
        sort: values.sort,
        sortBy: values.sortBy,
      } as IDailyExpenseFilters);
      const excelData: any[] = [];
      response.data.forEach((dailyExpense: IDailyExpense, index: number) => {
        excelData.push({
          "S No.": index + 1,
          Date: utilSvc.formatDate(dailyExpense.date),
          Vehicle: dailyExpense.vehicle?.vehicleNumber,
          "Expense On Fuel": dailyExpense?.expenseOnFuel || "",
          Challan: dailyExpense.challan || "",
          "Other Expenses": dailyExpense.otherExpenses || "",
          Status: dailyExpense.status,
          "Created By": dailyExpense.createdBy.name,
          "Updated By": dailyExpense.createdBy.name,
          "Created On": utilSvc.formatDate(dailyExpense.createdAt),
          "Updated On": utilSvc.formatDate(dailyExpense.updatedAt),
        });
      });
      let fileName = "Daily Expenses";
      const timestamp = utilSvc.formatDate(new Date(), DateFormats.DD_MM_YYYY_H_MM_A);
      fileName = `${fileName}-${timestamp}`;
      utilSvc.exportAsExcel(excelData, fileName);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const deleteDailyExpense = async (id: string) => {
    try {
      await dailyExpenseSvc.deleteDailyExpense(id);
      notifySvc.showSucces(AppMessages.DAILY_EXPENSE_DELETED);
      loadDailyExpenses(values);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const paginatorModelChange = async (model: GridPaginationModel) => {
    if (model.pageSize !== values.limit) {
      await setFieldValue("page", 0);
      await setFieldValue("limit", model.pageSize);
    } else {
      await setFieldValue("page", model.page);
      await setFieldValue("limit", model.pageSize);
    }
  };

  const sortingModelChange = async (model: GridSortModel) => {
    await setFieldValue("sort", model?.[0]?.field || values.sort);
    await setFieldValue("sortBy", model?.[0]?.sort || SortBy.ASC);
  };

  const toggleListAndCardView = async () => {
    if (values.page !== AppDefaults.PAGE_NO) {
      await setFieldValue("page", 0);
    }
    setShowListView(!showListView);
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-4">{loggedInUser.role === UserRoles.ADMIN ? <BackButton /> : null}</div>
        <div className="col-8 text-end">
          <Button variant="contained" color="primary" onClick={() => navigate("/daily-expenses/new")}>
            <AddTwoToneIcon fontSize="small" className="me-1" /> Add Daily Expense
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader title="Daily Expenses" className="card-heading" />
        <Divider />
        <CardContent>
          <div className="row">
            <div className="col-md-6 col-7">
              <SearchBox values={values} setFieldValue={setFieldValue} />
            </div>
            <div className="col-md-6 col-5 text-end">
              {showListView ? (
                <BootstrapTooltip title="Card View" onClick={toggleListAndCardView}>
                  <WindowTwoToneIcon className="me-3 curson-pointer" />
                </BootstrapTooltip>
              ) : (
                <BootstrapTooltip title="List View" onClick={toggleListAndCardView}>
                  <FormatListBulletedTwoToneIcon className="me-3 curson-pointer" />
                </BootstrapTooltip>
              )}
              <BootstrapTooltip title="Download" onClick={exportDailyExpenses}>
                <DownloadTwoToneIcon className="me-3 curson-pointer" />
              </BootstrapTooltip>
              <BootstrapTooltip title="Filters" onClick={() => setShowFilters(!showFilters)}>
                <FilterListTwoToneIcon className="curson-pointer" />
              </BootstrapTooltip>
            </div>
            {showFilters ? (
              <div className="col-12 mt-4">
                <DailyExpenseFilters vehicles={vehicles} drivers={drivers} values={values} setFieldValue={setFieldValue} />
              </div>
            ) : null}

            <div className="col-12 mt-4">
              {showListView ? (
                <DailyExpenseList
                  values={values}
                  dailyExpenses={dailyExpenses}
                  onDelete={deleteDailyExpense}
                  onSortModelChange={sortingModelChange}
                  onPaginationModelChange={paginatorModelChange}
                />
              ) : (
                <DailyExpenseCards
                  dailyExpenses={dailyExpenses}
                  values={values}
                  setFieldValue={setFieldValue}
                  onDelete={deleteDailyExpense}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyExpensesListCardView;
