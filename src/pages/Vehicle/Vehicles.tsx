import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import FilterListTwoToneIcon from "@mui/icons-material/FilterListTwoTone";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import WindowTwoToneIcon from "@mui/icons-material/WindowTwoTone";
import { Button, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { AppDefaults, AppMessages, DateFormats, SortBy } from "../../data/app.constant";
import { IVehicleFilters } from "../../interfaces/filter.interface";
import { IListResponse } from "../../interfaces/response.interface";
import { IVehicleType } from "../../interfaces/vehicle-type.interface";
import { IVehicle } from "../../interfaces/vehicle.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { UtilService } from "../../services/util.service";
import { VehicleTypeService } from "../../services/vehicle-type.service";
import { VehicleService } from "../../services/vehicle.service";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";
import SearchBox from "../../shared/components/Common/SearchBox";
import VehicleCards from "./components/VehicleCards";
import VehicleFilters from "./components/VehicleFilters";
import VehicleList from "./components/VehicleList";

const initialValues: any = {
  q: "",
  status: "",
  vehicleType: "",
  page: AppDefaults.PAGE_NO,
  limit: AppDefaults.PAGE_LIMIT,
  sort: AppDefaults.SORT,
  sortBy: AppDefaults.SORT_BY,
};

const Vehicles = () => {
  const notifySvc = new AppNotificationService();
  const vehicleSvc = new VehicleService();
  const utilSvc = new UtilService();
  const vehicleTypeSvc = new VehicleTypeService();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<IListResponse>({
    total: 0,
    data: [],
  });
  const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
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

  const debounced = useDebouncedCallback((formData: IVehicleFilters) => {
    loadVehicles(formData);
  }, 500);

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  const loadVehicleTypes = async () => {
    try {
      const response = await vehicleTypeSvc.getVehicleTypes({});
      setVehicleTypes(response.data);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  useEffect(() => {
    loadVehicles(initialValues as IVehicleFilters);
  }, []);

  const loadVehicles = async (filters: IVehicleFilters) => {
    try {
      filters = { ...filters, page: (filters.page || 0) + 1 };
      const response = await vehicleSvc.getVehicles(filters);
      setVehicles(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const exportVehicles = async () => {
    try {
      const response = await vehicleSvc.getVehicles({
        q: values.q,
        status: values.status,
        vehicleType: values.vehicleType,
        sort: values.sort,
        sortBy: values.sortBy,
      } as IVehicleFilters);
      const excelData: any[] = [];
      response.data.forEach((vehicle: IVehicle, index: number) => {
        excelData.push({
          "S No.": index + 1,
          "Vehicle Number": vehicle.vehicleNumber,
          "Vehicle Company": vehicle.company,
          Capacity: vehicle?.capacity || "",
          "Vehicle Type": vehicle.vehicleType.name || "",
          "Manufacturing Year": vehicle.mfgYear ? utilSvc.formatDate(vehicle.mfgYear, DateFormats.MMMM_YYYY) : "",
          "Chassis Number": vehicle?.chassisNumber || "",
          "Registration Number": vehicle?.regNumber || "",
          Status: vehicle.status,
          "Created On": utilSvc.formatDate(vehicle.createdAt),
          "Updated On": utilSvc.formatDate(vehicle.updatedAt),
        });
      });
      let fileName = "Vehicles";
      const timestamp = utilSvc.formatDate(new Date(), DateFormats.DD_MM_YYYY_H_MM_A);
      fileName = `${fileName}-${timestamp}`;
      utilSvc.exportAsExcel(excelData, fileName);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehicleSvc.deleteVehicle(id);
      notifySvc.showSucces(AppMessages.VEHICLE_DELETED);
      loadVehicles(values);
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
          <Button variant="contained" color="primary" onClick={() => navigate("/vehicles/new")}>
            <AddTwoToneIcon fontSize="small" className="me-1" /> Add Vehicle
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader title="Vehicles" className="card-heading" />
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
              <BootstrapTooltip title="Download" onClick={exportVehicles}>
                <DownloadTwoToneIcon className="me-3 curson-pointer" />
              </BootstrapTooltip>
              <BootstrapTooltip title="Filters" onClick={() => setShowFilters(!showFilters)}>
                <FilterListTwoToneIcon className="curson-pointer" />
              </BootstrapTooltip>
            </div>
            {showFilters ? (
              <div className="col-12 mt-4">
                <VehicleFilters vehicleTypes={vehicleTypes} values={values} setFieldValue={setFieldValue} />
              </div>
            ) : null}

            <div className="col-12 mt-4">
              {showListView ? (
                <VehicleList
                  values={values}
                  vehicles={vehicles}
                  onDelete={deleteVehicle}
                  onSortModelChange={sortingModelChange}
                  onPaginationModelChange={paginatorModelChange}
                />
              ) : (
                <VehicleCards vehicles={vehicles} values={values} setFieldValue={setFieldValue} onDelete={deleteVehicle} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vehicles;
