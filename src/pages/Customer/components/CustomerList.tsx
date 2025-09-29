import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { AppDefaults, PageSizeOptions } from "../../../data/app.constant";
import { IListResponse } from "../../../interfaces/response.interface";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";
import AvatarImage from "../../../shared/components/Common/AvatarImage";
import GridActions from "../../../shared/components/Common/GridActions";
import GridCreatedOn from "../../../shared/components/Common/GridCreatedOn";
import UserContactNo from "../../../shared/components/Common/UserContactNo";
import UserEmail from "../../../shared/components/Common/UserEmail";

interface IProps {
  customers: IListResponse;
  values: any;
  onPaginationModelChange: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  onSortModelChange: ((model: GridSortModel, details: GridCallbackDetails<any>) => void) | undefined;
}

const columns: GridColDef[] = [
  {
    field: "imageUrl",
    headerName: "",
    sortable: false,
    width: 100,
    renderCell: (params) => <AvatarImage imageUrl={params.row?.imageUrl} />,
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
    field: "email",
    headerName: "Email",
    sortable: true,
    width: 230,
    renderCell: (params) => <UserEmail user={{ ...params.row }} />,
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
    headerName: "Action",
    sortable: false,
    width: 200,
    renderCell: (params) => <GridActions info={{ ...params.row }} path="/customers" hideEditBtn={true} hideDeleteBtn={true} />,
    cellClassName: "ps-0",
  },
];

const CustomerList = ({ customers, values, onPaginationModelChange, onSortModelChange }: IProps) => {
  return (
    <DataGrid
      className="data-grid-table"
      rows={customers.data}
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
      rowCount={customers.total}
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

export default CustomerList;
