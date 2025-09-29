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
import { AccountType, AccountTypeLabel, AppDefaults, AppMessages, DateFormats, SortBy } from "../../data/app.constant";
import { IDriverFilters } from "../../interfaces/filter.interface";
import { IListResponse } from "../../interfaces/response.interface";
import { IUser } from "../../interfaces/user.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { DriverService } from "../../services/driver.service";
import { UtilService } from "../../services/util.service";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";
import SearchBox from "../../shared/components/Common/SearchBox";
import DriverCards from "./components/DriverCards";
import DriverFilters from "./components/DriverFilters";
import DriverList from "./components/DriverList";

const initialValues: any = {
  q: "",
  status: "",
  page: AppDefaults.PAGE_NO,
  limit: AppDefaults.PAGE_LIMIT,
  sort: AppDefaults.SORT,
  sortBy: AppDefaults.SORT_BY,
};

const Drivers = () => {
  const notifySvc = new AppNotificationService();
  const driverSvc = new DriverService();
  const utilSvc = new UtilService();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<IListResponse>({
    total: 0,
    data: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showListView, setShowListView] = useState<boolean>(!utilSvc.isMobile());

  const { values, setFieldValue } = useFormik({
    initialValues,

    onSubmit: (values) => {},

    validate: (values: any) => {
      debounced(values);
      return {};
    },
  });

  const debounced = useDebouncedCallback((formData: IDriverFilters) => {
    loadDrivers(formData);
  }, 500);

  useEffect(() => {
    loadDrivers(initialValues as IDriverFilters);
  }, []);

  const loadDrivers = async (filters: IDriverFilters) => {
    try {
      filters = { ...filters, page: (filters.page || 0) + 1 };
      const response = await driverSvc.getDrivers(filters);
      setDrivers(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const exportDrivers = async () => {
    try {
      const response = await driverSvc.getDrivers({
        q: values.q,
        status: values.status,
        sort: values.sort,
        sortBy: values.sortBy,
      } as IDriverFilters);
      const excelData: any[] = [];
      response.data.forEach((driver: IUser, index: number) => {
        excelData.push({
          "S No.": index + 1,
          Name: driver.name,
          Email: driver.email,
          "License Number": driver?.licenseNumber || "",
          Username: driver.userName,
          "Contact Number": driver.contactNumber,
          Status: driver.status,
          "Account Type": driver.accountType === AccountType.LOCAL ? AccountTypeLabel.LOCAL : AccountTypeLabel.GOOGLE,
          "Created On": utilSvc.formatDate(driver.createdAt),
          "Updated On": utilSvc.formatDate(driver.updatedAt),
        });
      });
      let fileName = "Drivers";
      const timestamp = utilSvc.formatDate(new Date(), DateFormats.DD_MM_YYYY_H_MM_A);
      fileName = `${fileName}-${timestamp}`;
      utilSvc.exportAsExcel(excelData, fileName);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      await driverSvc.deleteDriver(id);
      notifySvc.showSucces(AppMessages.DRIVER_DELETED);
      loadDrivers(values);
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
        <div className="col-12 text-end">
          <Button variant="contained" color="primary" onClick={() => navigate("/drivers/new")}>
            <AddTwoToneIcon fontSize="small" className="me-1" /> Add Driver
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader title="Drivers" className="card-heading" />
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
              <BootstrapTooltip title="Download" onClick={exportDrivers}>
                <DownloadTwoToneIcon className="me-3 curson-pointer" />
              </BootstrapTooltip>
              <BootstrapTooltip title="Filters" onClick={() => setShowFilters(!showFilters)}>
                <FilterListTwoToneIcon className="curson-pointer" />
              </BootstrapTooltip>
            </div>
            {showFilters ? (
              <div className="col-12 mt-4">
                <DriverFilters values={values} setFieldValue={setFieldValue} />
              </div>
            ) : null}

            <div className="col-12 mt-4">
              {showListView ? (
                <DriverList
                  values={values}
                  drivers={drivers}
                  onDelete={deleteDriver}
                  onSortModelChange={sortingModelChange}
                  onPaginationModelChange={paginatorModelChange}
                />
              ) : (
                <DriverCards drivers={drivers} values={values} setFieldValue={setFieldValue} onDelete={deleteDriver} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Drivers;
