import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { AppDefaults, SortBy, TripStatus, UserRoles } from "../../data/app.constant";
import { ITripFilters } from "../../interfaces/filter.interface";
import { IListResponse } from "../../interfaces/response.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { TripService } from "../../services/trip.service";
import { UtilService } from "../../services/util.service";
import SearchBox from "../../shared/components/Common/SearchBox";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TripList from "./components/TripList";
import { IUser } from "../../interfaces/user.interface";
import { useAppSelector } from "../../redux/hooks";

const initialValues: any = {
  q: "",
  status: "",
  page: AppDefaults.PAGE_NO,
  limit: AppDefaults.PAGE_LIMIT,
  sort: AppDefaults.SORT,
  sortBy: AppDefaults.SORT_BY,
};

interface Props {
  showingOnDashboard?: boolean;
}

const Trips = ({ showingOnDashboard = false }: Props) => {
  const notifySvc = new AppNotificationService();
  const tripSvc = new TripService();
  const utilSvc = new UtilService();
  const navigate = useNavigate();
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  const [trips, setTrips] = useState<IListResponse>({
    total: 0,
    data: [],
  });
  const [showListView, setShowListView] = useState<boolean>(!utilSvc.isMobile());

  const { values, setFieldValue } = useFormik({
    initialValues,
    onSubmit: () => {},
    validate: (values: any) => {
      debounced(values);
      return {};
    },
  });

  const debounced = useDebouncedCallback((formData: ITripFilters) => {
    loadTrips(formData);
  }, 500);

  useEffect(() => {
    loadTrips(initialValues as ITripFilters);
  }, []);

  const loadTrips = async (filters: ITripFilters) => {
    try {
      filters = { ...filters, page: (filters.page || 0) + 1 };
      const response = await tripSvc.getTrips(filters);
      setTrips(response);
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
  const onCancel = async (id: string) => {
    try {
      await tripSvc.updateTripStatus(id as string, {
        status: TripStatus.CANCELLED,
      });
      loadTrips(values);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className={!showingOnDashboard ? "content-wrapper" : ""}>
      {loggedInUser.role === UserRoles.CUSTOMER ? (
        <div className="row my-4">
          <div className="col-12 text-end">
            <Button variant="contained" color="primary" onClick={() => navigate("/trips/new")}>
              <AddTwoToneIcon fontSize="small" className="me-1" /> Add Trip
            </Button>
          </div>
        </div>
      ) : null}
      <Card>
        <CardHeader title="Trips" className="card-heading" />
        <Divider />
        <CardContent>
          <div className="row">
            <div className="col-md-6 col-6">
              <SearchBox values={values} setFieldValue={setFieldValue} />
            </div>
            <div className="col-md-6 col-6">
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
                  {loggedInUser.role === UserRoles.ADMIN || loggedInUser.role === UserRoles.CUSTOMER ? (
                    <MenuItem value={TripStatus.NEW}>{TripStatus.NEW}</MenuItem>
                  ) : null}
                  <MenuItem value={TripStatus.SCHEDULED}>{TripStatus.SCHEDULED}</MenuItem>
                  <MenuItem value={TripStatus.INPROGRESS}>{TripStatus.INPROGRESS}</MenuItem>
                  <MenuItem value={TripStatus.COMPLETED}>{TripStatus.COMPLETED}</MenuItem>
                  <MenuItem value={TripStatus.CANCELLED}>{TripStatus.CANCELLED}</MenuItem>
                </Select>
              </FormControl>
            </div>
            {/* <div className="col-md-6 col-5 text-end">
              <BootstrapTooltip title="Filters" onClick={() => setShowFilters(!showFilters)}>
                <FilterListTwoToneIcon className="curson-pointer" />
              </BootstrapTooltip>
            </div> */}
            {/* {showFilters ? (
              <div className="col-12 mt-4">
                <TripFilters values={values} setFieldValue={setFieldValue} />
              </div>
            ) : null} */}

            <div className="col-12 mt-4">
              <TripList
                values={values}
                trips={trips}
                // onSortModelChange={sortingModelChange}
                onPaginationModelChange={paginatorModelChange}
                onCancel={onCancel}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trips;
