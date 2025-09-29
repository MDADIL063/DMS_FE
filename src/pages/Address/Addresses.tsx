import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import WindowTwoToneIcon from "@mui/icons-material/WindowTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { AppDefaults, AppMessages, SortBy } from "../../data/app.constant";
import { IAddressFilters } from "../../interfaces/filter.interface";
import { IListResponse } from "../../interfaces/response.interface";
import { AddressService } from "../../services/address.service";
import { AppNotificationService } from "../../services/app-notification.service";
import { UtilService } from "../../services/util.service";
import SearchBox from "../../shared/components/Common/SearchBox";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";
import AddressCards from "./components/AddressCards";
import AddressList from "./components/AddressList";

const initialValues: any = {
  q: "",
  page: AppDefaults.PAGE_NO,
  limit: AppDefaults.PAGE_LIMIT,
  sort: AppDefaults.SORT,
  sortBy: AppDefaults.SORT_BY,
};

const Addresses = () => {
  const notifySvc = new AppNotificationService();
  const addressSvc = new AddressService();
  const utilSvc = new UtilService();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<IListResponse>({
    total: 0,
    data: [],
  });
  const [showListView, setShowListView] = useState<boolean>(!utilSvc.isMobile());

  const { values, setFieldValue } = useFormik({
    initialValues,

    onSubmit: (values) => {},

    validate: (values: any) => {
      debounced(values);
      return {};
    },
  });

  const debounced = useDebouncedCallback((formData: IAddressFilters) => {
    loadAddresses(formData);
  }, 500);

  useEffect(() => {
    loadAddresses(initialValues as IAddressFilters);
  }, []);

  const loadAddresses = async (filters: IAddressFilters) => {
    try {
      filters = { ...filters, page: (filters.page || 0) + 1 };
      const response = await addressSvc.getAddresses(filters);
      setAddresses(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await addressSvc.deleteAddress(id);
      notifySvc.showSucces(AppMessages.ADDRESS_DELETED);
      loadAddresses(values);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const makePrimary = async (id: string) => {
    try {
      await addressSvc.makeAddressPrimary(id);
      notifySvc.showSucces(AppMessages.ADDRESS_MADE_PRIMARY);
      loadAddresses(values);
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
          <Button variant="contained" color="primary" onClick={() => navigate("/address/new")}>
            <AddTwoToneIcon fontSize="small" className="me-1" /> Add Address
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader title="Address" className="card-heading" />
        <Divider />
        <CardContent>
          <div className="row">
            <div className="col-md-6 col-8">
              <SearchBox values={values} setFieldValue={setFieldValue} />
            </div>
            <div className="col-md-6 col-4 text-end">
              {showListView ? (
                <BootstrapTooltip title="Card View" onClick={toggleListAndCardView}>
                  <WindowTwoToneIcon className="me-3 curson-pointer" />
                </BootstrapTooltip>
              ) : (
                <BootstrapTooltip title="List View" onClick={toggleListAndCardView}>
                  <FormatListBulletedTwoToneIcon className="me-3 curson-pointer" />
                </BootstrapTooltip>
              )}
            </div>
            <div className="col-12 mt-4">
              {showListView ? (
                <AddressList
                  values={values}
                  addresses={addresses}
                  makePrimary={makePrimary}
                  onDelete={deleteAddress}
                  onSortModelChange={sortingModelChange}
                  onPaginationModelChange={paginatorModelChange}
                />
              ) : (
                <AddressCards
                  addresses={addresses}
                  values={values}
                  makePrimary={makePrimary}
                  setFieldValue={setFieldValue}
                  onDelete={deleteAddress}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Addresses;
