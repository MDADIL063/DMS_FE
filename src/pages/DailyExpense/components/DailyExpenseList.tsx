import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { AppDefaults, AppMessages, DailyExpenseStatus, InternalStatusTypes, PageSizeOptions, UserRoles } from "../../../data/app.constant";
import { IDailyExpense } from "../../../interfaces/daily-expense.interface";
import { IListResponse } from "../../../interfaces/response.interface";
import { IUser } from "../../../interfaces/user.interface";
import { useAppSelector } from "../../../redux/hooks";
import { UtilService } from "../../../services/util.service";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";
import Currency from "../../../shared/components/Common/Currency";
import ExternalLink from "../../../shared/components/Common/ExternalLink";
import GridActions from "../../../shared/components/Common/GridActions";
import GridCreatedOn from "../../../shared/components/Common/GridCreatedOn";

interface IProps {
  dailyExpenses: IListResponse;
  values: any;
  onDelete: (id: string) => void;
  onPaginationModelChange: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined;
  onSortModelChange: ((model: GridSortModel, details: GridCallbackDetails<any>) => void) | undefined;
}

const DailyExpenseList = ({ dailyExpenses, values, onDelete, onPaginationModelChange, onSortModelChange }: IProps) => {
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      width: 190,
      valueGetter: (params, value: IDailyExpense) => `${new UtilService().formatDate(value.date)}`,
    },
    {
      field: "total",
      headerName: "Total Expense (Per Day)",
      sortable: false,
      width: 190,
      renderCell: (params) => (
        <Currency value={(params.row.expenseOnFuel || 0) + (params.row.challan || 0) + (params.row.otherExpenses || 0)} />
      ),
      cellClassName: "text-danger fw-bold",
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      sortable: false,
      width: 190,
      renderCell: (params) =>
        loggedInUser.role === UserRoles.ADMIN ? (
          <ExternalLink path={`/vehicles/${params.row.vehicle?._id}`} text={params.row.vehicle?.vehicleNumber} />
        ) : (
          <>{params.row.vehicle?.vehicleNumber}</>
        ),
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      width: 190,
      renderCell: (params) => <ActivityStatusChip info={{ ...params.row }} statusType={InternalStatusTypes.DAILY_EXPENSE_STATUS} />,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      sortable: false,
      width: 190,
      valueGetter: (params, value: IDailyExpense) => `${value.createdBy.name}`,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      sortable: true,
      width: 190,
      renderCell: (params) => <GridCreatedOn info={{ ...params.row }} />,
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 190,
      renderCell: (params) => (
        <GridActions
          info={{ ...params.row }}
          path="/daily-expenses"
          deleteConfirmMsg={AppMessages.DAILY_EXPENSE_DELETE_CONFIRM}
          hideEditBtn={params.row.status === DailyExpenseStatus.APPROVED}
          hideDeleteBtn={params.row.status === DailyExpenseStatus.APPROVED && loggedInUser.role === UserRoles.DRIVER}
          onDelete={onDelete}
        />
      ),
      cellClassName: "ps-0",
    },
  ];

  return (
    <DataGrid
      className="data-grid-table"
      rows={dailyExpenses.data}
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
      rowCount={dailyExpenses.total}
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

export default DailyExpenseList;
