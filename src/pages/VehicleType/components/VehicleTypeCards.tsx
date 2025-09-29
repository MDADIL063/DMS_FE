import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import { FormikErrors } from "formik";
import { PageSizeOptions } from "../../../data/app.constant";
import { IVehicleTypeFilters } from "../../../interfaces/filter.interface";
import { IListResponse } from "../../../interfaces/response.interface";
import { IVehicleType } from "../../../interfaces/vehicle-type.interface";
import VehicleTypeSingleCard from "./VehicleTypeSingleCard";

interface IProps {
  vehicleTypes: IListResponse;
  values: IVehicleTypeFilters;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

const VehicleTypeCards = ({ vehicleTypes, values, setFieldValue, onDelete, onUpdate }: IProps) => {
  const handleChangePage = async (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    await setFieldValue("page", newPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    await setFieldValue("page", 0);
    await setFieldValue("limit", parseInt(event.target.value, 10));
  };

  return (
    <Grid container spacing={2}>
      {vehicleTypes.data.map((vehicleType: IVehicleType) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={vehicleType._id}>
          <VehicleTypeSingleCard vehicleType={vehicleType} onDelete={onDelete} onUpdate={onUpdate} />
        </Grid>
      ))}
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Divider />
        <TablePagination
          component="div"
          count={vehicleTypes.total}
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

export default VehicleTypeCards;
