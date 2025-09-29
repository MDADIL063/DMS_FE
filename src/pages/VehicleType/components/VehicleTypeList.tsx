import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import React from "react";
import { IListResponse } from "../../../interfaces/response.interface";
import { UtilService } from "../../../services/util.service";
import VehicleTypeAction from "./VehicleTypeAction";
import { AppDefaults, PageSizeOptions } from "../../../data/app.constant";

interface IProps {
  vehicleTypes: IListResponse;
  values: any;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  onPaginationModelChange: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  onSortModelChange: ((model: GridSortModel, details: GridCallbackDetails<any>) => void) | undefined;
}

const VehicleTypeList = ({ vehicleTypes, values, onUpdate, onDelete, onPaginationModelChange, onSortModelChange }: IProps) => {
  const utilSvc = new UtilService();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      width: 350,
      headerClassName: "ps-4",
      cellClassName: "ps-4",
    },
    {
      field: "createdAt",
      headerName: "Created On",
      sortable: true,
      width: 350,
      valueGetter: (value) => `${utilSvc.formatDate(value)}`,
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      sortable: true,
      width: 350,
      valueGetter: (value) => `${utilSvc.formatDate(value)}`,
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => <VehicleTypeAction vehicleType={{ ...params.row }} onUpdate={onUpdate} onDelete={onDelete} />,
      cellClassName: "ps-0",
    },
  ];

  return (
    <DataGrid
      className="data-grid-table"
      rows={vehicleTypes.data}
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
      rowCount={vehicleTypes.total}
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

export default VehicleTypeList;
