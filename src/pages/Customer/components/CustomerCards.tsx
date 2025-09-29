import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import { FormikErrors } from "formik";
import { PageSizeOptions } from "../../../data/app.constant";
import { IDriverFilters } from "../../../interfaces/filter.interface";
import { IListResponse } from "../../../interfaces/response.interface";
import { IUser } from "../../../interfaces/user.interface";
import CustomerSingleCard from "./CustomerSingleCard";

interface IProps {
  customers: IListResponse;
  values: IDriverFilters;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
}

const CustomerCards = ({ customers, values, setFieldValue }: IProps) => {
  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    await setFieldValue("page", newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    await setFieldValue("page", 0);
    await setFieldValue("limit", parseInt(event.target.value, 10));
  };

  return (
    <Grid container spacing={2}>
      {customers.data.map((customer: IUser) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={customer._id}>
          <CustomerSingleCard customer={customer} />
        </Grid>
      ))}
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Divider />
        <TablePagination
          component="div"
          count={customers.total}
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

export default CustomerCards;
