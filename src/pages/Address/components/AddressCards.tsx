import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import { FormikErrors } from "formik";
import React from "react";
import { PageSizeOptions } from "../../../data/app.constant";
import { IAddress } from "../../../interfaces/address.interface";
import { IAddressFilters } from "../../../interfaces/filter.interface";
import { IListResponse } from "../../../interfaces/response.interface";
import AddressSingleCard from "./AddressSingleCard";

interface IProps {
  addresses: IListResponse;
  values: IAddressFilters;
  makePrimary: (id: string) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
  onDelete: (id: string) => void;
}

const AddressCards = ({ addresses, values, makePrimary, setFieldValue, onDelete }: IProps) => {
  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    await setFieldValue("page", newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    await setFieldValue("page", 0);
    await setFieldValue("limit", parseInt(event.target.value, 10));
  };

  return (
    <Grid container spacing={2}>
      {addresses.data.map((address: IAddress) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={address._id}>
          <AddressSingleCard address={address} makePrimary={makePrimary} onDelete={onDelete} />
        </Grid>
      ))}
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Divider />
        <TablePagination
          component="div"
          count={addresses.total}
          page={values.page as number}
          rowsPerPage={values.limit as number}
          rowsPerPageOptions={PageSizeOptions}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
};

export default AddressCards;
