import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowClassNameParams,
  GridSortDirection,
  GridSortModel,
} from "@mui/x-data-grid";
import { AppDefaults, AppMessages, PageSizeOptions } from "../../../data/app.constant";
import { IAddress } from "../../../interfaces/address.interface";
import { IListResponse } from "../../../interfaces/response.interface";
import { UtilService } from "../../../services/util.service";
import GridActions from "../../../shared/components/Common/GridActions";

interface IProps {
  addresses: IListResponse;
  values: any;
  makePrimary: (id: string) => void;
  onDelete: (id: string) => void;
  onPaginationModelChange: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  onSortModelChange: ((model: GridSortModel, details: GridCallbackDetails<any>) => void) | undefined;
}

const AddressList = ({ addresses, values, makePrimary, onDelete, onPaginationModelChange, onSortModelChange }: IProps) => {
  const utilSvc = new UtilService();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 240,
      headerClassName: "ps-4",
      cellClassName: "ps-4",
    },
    {
      field: "address",
      headerName: "Address",
      sortable: false,
      width: 600,
      valueGetter: (value, row: IAddress) => `${utilSvc.getFullAddress(row)}`,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      sortable: true,
      width: 200,
      valueGetter: (value) => `${utilSvc.formatDate(value)}`,
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <GridActions
          info={{ ...params.row }}
          path="/address"
          showMakePrimaryBtn={!params.row.isPrimary}
          deleteConfirmMsg={AppMessages.ADDRESS_DELETE_CONFIRM}
          onMakePrimary={makePrimary}
          onDelete={onDelete}
        />
      ),
      cellClassName: "ps-0",
    },
  ];
  return (
    <DataGrid
      className="data-grid-table"
      rows={addresses.data}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: values.page, pageSize: values.limit },
        },
        sorting: {
          sortModel: [
            {
              field: values.sort,
              sort: values.sortBy as GridSortDirection,
            },
          ],
        },
      }}
      paginationMode={AppDefaults.PAGINATION_AND_SORTING_MODE}
      sortingMode={AppDefaults.PAGINATION_AND_SORTING_MODE}
      rowCount={addresses.total}
      pageSizeOptions={PageSizeOptions}
      getRowId={(row) => row._id}
      rowSelection={false}
      disableColumnResize={true}
      paginationModel={{ page: values.page, pageSize: values.limit }}
      rowHeight={AppDefaults.LIST_ROW_HEIGHT as number}
      sortModel={[
        {
          field: values.sort,
          sort: values.sortBy as GridSortDirection,
        },
      ]}
      onPaginationModelChange={onPaginationModelChange}
      onSortModelChange={onSortModelChange}
      getRowClassName={(params: GridRowClassNameParams<any>) => (params.row.isPrimary ? "primary-address" : "")}
    />
  );
};

export default AddressList;
