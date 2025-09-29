import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { AppDefaults, AppMessages, PageSizeOptions } from "../../../data/app.constant";
import { IListResponse } from "../../../interfaces/response.interface";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";
import AvatarImage from "../../../shared/components/Common/AvatarImage";
import GridActions from "../../../shared/components/Common/GridActions";
import GridCreatedOn from "../../../shared/components/Common/GridCreatedOn";
import UserContactNo from "../../../shared/components/Common/UserContactNo";

interface IProps {
  drivers: IListResponse;
  values: any;
  onDelete: (id: string) => void;
  onPaginationModelChange: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  onSortModelChange: ((model: GridSortModel, details: GridCallbackDetails<any>) => void) | undefined;
}

const DriverList = ({ drivers, values, onDelete, onPaginationModelChange, onSortModelChange }: IProps) => {
  const columns: GridColDef[] = [
    {
      field: "imageUrl",
      headerName: "",
      sortable: false,
      width: 100,
      renderCell: (params) => <AvatarImage imageUrl={params?.row?.imageUrl} />,
    },
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 200,
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      sortable: true,
      width: 200,
      renderCell: (params) => <UserContactNo user={{ ...params.row }} />,
    },
    {
      field: "licenseNumber",
      headerName: "License Number",
      sortable: true,
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      width: 200,
      renderCell: (params) => <ActivityStatusChip info={{ ...params.row }} />,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      sortable: true,
      width: 200,
      renderCell: (params) => <GridCreatedOn info={{ ...params.row }} />,
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <GridActions info={{ ...params.row }} path="/drivers" deleteConfirmMsg={AppMessages.DRIVER_DELETE_CONFIRM} onDelete={onDelete} />
      ),
      cellClassName: "ps-0",
    },
  ];

  return (
    <DataGrid
      className="data-grid-table"
      rows={drivers.data}
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
      rowCount={drivers.total}
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
    />
  );
};

export default DriverList;
