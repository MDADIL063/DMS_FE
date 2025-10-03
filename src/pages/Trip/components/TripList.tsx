import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { AppDefaults, AppMessages, InternalStatusTypes, PageSizeOptions, SortBy } from "../../../data/app.constant";
import { IListResponse } from "../../../interfaces/response.interface";
import GridActions from "../../../shared/components/Common/GridActions";
import GridCreatedOn from "../../../shared/components/Common/GridCreatedOn";
import { IUser } from "../../../interfaces/user.interface";
import { useMemo } from "react";
import { IVehicle } from "../../../interfaces/vehicle.interface";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";

interface IProps {
  trips: IListResponse;
  values: any;
  onDelete: (id: string) => void;
  onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails<any>) => void;
  onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails<any>) => void;
}

const TripList = ({ trips, values, onDelete, onPaginationModelChange, onSortModelChange }: IProps) => {
  const columns: GridColDef[] = [
    {
      field: "reason",
      headerName: "Reason",
      sortable: true,
      width: 200,
    },
    {
      field: "customer",
      headerName: "Customer",
      sortable: true,
      width: 200,
      valueGetter: (params: IUser) => params?.name,
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      sortable: true,
      width: 200,
      valueGetter: (params: IVehicle) => params?.vehicleNumber,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      width: 150,
      renderCell: (params) => <ActivityStatusChip info={{ ...params.row }} verient="filled" statusType={InternalStatusTypes.TRIP_STATUS} />,
    },
    {
      field: "itemToCarry",
      headerName: "Item",
      sortable: true,
      width: 150,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      sortable: true,
      width: 120,
    },
    {
      field: "startDateTime",
      headerName: "Start Date",
      sortable: true,
      width: 200,
      //   renderCell: (params) => <GridCreatedOn  info={createdAt: params.value }/>,//  info={{ createdAt: params.value }}
    },

    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <GridActions info={{ ...params.row }} path="/trips" deleteConfirmMsg={AppMessages.TRIP_DELETE_CONGIRM} onDelete={onDelete} />
      ),
      cellClassName: "ps-0",
    },
  ];

  return (
    <DataGrid
      className="data-grid-table"
      rows={trips.data}
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
      //   paginationMode={AppDefaults.PAGINATION_AND_SORTING_MODE}
      //   sortingMode={AppDefaults.PAGINATION_AND_SORTING_MODE}
      rowCount={trips.total}
      pageSizeOptions={PageSizeOptions}
      getRowId={(row) => row._id}
      rowSelection={false}
      disableColumnResize
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

export default TripList;
