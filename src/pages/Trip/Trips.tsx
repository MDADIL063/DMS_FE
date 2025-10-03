import { Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { AppDefaults, SortBy } from "../../data/app.constant";
import { ITripFilters } from "../../interfaces/filter.interface";
import { IListResponse } from "../../interfaces/response.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { TripService } from "../../services/trip.service";
import { UtilService } from "../../services/util.service";
import SearchBox from "../../shared/components/Common/SearchBox";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TripList from "./components/TripList";

const initialValues: any = {
  q: "",
  status: "",
  page: AppDefaults.PAGE_NO,
  limit: AppDefaults.PAGE_LIMIT,
  sort: AppDefaults.SORT,
  sortBy: AppDefaults.SORT_BY,
};

const Trips = () => {
  const notifySvc = new AppNotificationService();
  const tripSvc = new TripService();
  const utilSvc = new UtilService();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<IListResponse>({
    total: 0,
    data: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
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
  const deleteTrip = (id: string) => {
    console.log("Deleting trip with id:", id);
    // call service to delete
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        {/* <div className="col-12 text-end">
          <Button variant="contained" color="primary" onClick={() => navigate("/trips/new")}>
            <AddTwoToneIcon fontSize="small" className="me-1" /> Add Trip
          </Button>
        </div> */}
      </div>
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
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="InProgress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                onDelete={deleteTrip}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trips;
