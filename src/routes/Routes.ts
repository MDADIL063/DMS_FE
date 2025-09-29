import { RouteObject, useRoutes } from "react-router-dom";
import { RouteType, UserRoles } from "../data/app.constant";
import { IUser } from "../interfaces/user.interface";
import { useAppSelector } from "../redux/hooks";
import { AuthService } from "../services/auth.service";
import AuthenticateRoute from "./AuthenticateRoute";
import LazyLoadRoutes from "./LazyLoadRoutes";

export function RouterElement() {
  const authSvc = new AuthService();
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);

  const routes: RouteObject[] = [
    {
      path: "/",
      element: authSvc.canActivateRoute(RouteType.PUBLIC) ? LazyLoadRoutes("Auth", "Login") : AuthenticateRoute("/dashboard"),
    },
    {
      path: "login",
      element: authSvc.canActivateRoute(RouteType.PUBLIC) ? LazyLoadRoutes("Auth", "Login") : AuthenticateRoute("/dashboard"),
    },
    {
      path: "register",
      element: authSvc.canActivateRoute(RouteType.PUBLIC) ? LazyLoadRoutes("Auth", "Register") : AuthenticateRoute("/dashboard"),
    },
    {
      path: "dashboard",
      element: authSvc.canActivateRoute(RouteType.PRIVATE) ? LazyLoadRoutes("Dashboard", "Dashboard") : AuthenticateRoute("/login"),
    },
    {
      path: "customers",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Customer", "Customers")
        : AuthenticateRoute("/login"),
    },
    {
      path: "customers/:id",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Customer", "CustomerDetails")
        : AuthenticateRoute("/login"),
    },
    {
      path: "drivers",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Driver", "Drivers")
        : AuthenticateRoute("/login"),
    },
    {
      path: "drivers/:id",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Driver", "DriverDetails")
        : AuthenticateRoute("/login"),
    },
    {
      path: "drivers/new",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Driver", "AddEditDriver")
        : AuthenticateRoute("/login"),
    },
    {
      path: "drivers/:id/edit",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Driver", "AddEditDriver")
        : AuthenticateRoute("/login"),
    },
    {
      path: "vehicle-types",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("VehicleType", "VehicleTypes")
        : AuthenticateRoute("/login"),
    },
    {
      path: "vehicles",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Vehicle", "Vehicles")
        : AuthenticateRoute("/login"),
    },
    {
      path: "vehicles/:id",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Vehicle", "VehicleDetails")
        : AuthenticateRoute("/login"),
    },
    {
      path: "vehicles/new",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Vehicle", "AddVehicle")
        : AuthenticateRoute("/login"),
    },
    {
      path: "vehicles/:id/edit",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Vehicle", "EditVehicle")
        : AuthenticateRoute("/login"),
    },
    {
      path: "daily-expenses",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN, UserRoles.DRIVER])
        ? LazyLoadRoutes("DailyExpense", loggedInUser.role === UserRoles.ADMIN ? "DailyExpenses" : "DailyExpensesListCardView")
        : AuthenticateRoute("/login"),
    },
    {
      path: "daily-expenses/list",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN, UserRoles.DRIVER])
        ? LazyLoadRoutes("DailyExpense", "DailyExpensesListCardView")
        : AuthenticateRoute("/login"),
    },
    {
      path: "daily-expenses/:id",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN, UserRoles.DRIVER])
        ? LazyLoadRoutes("DailyExpense", "DailyExpenseDetails")
        : AuthenticateRoute("/login"),
    },
    {
      path: "daily-expenses/new",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN, UserRoles.DRIVER])
        ? LazyLoadRoutes("DailyExpense", "AddEditDailyExpense")
        : AuthenticateRoute("/login"),
    },
    {
      path: "daily-expenses/:id/edit",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN, UserRoles.DRIVER])
        ? LazyLoadRoutes("DailyExpense", "AddEditDailyExpense")
        : AuthenticateRoute("/login"),
    },
    {
      path: "address",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.CUSTOMER])
        ? LazyLoadRoutes("Address", "Addresses")
        : AuthenticateRoute("/login"),
    },
    {
      path: "address/:id",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.CUSTOMER])
        ? LazyLoadRoutes("Address", "AddressDetails")
        : AuthenticateRoute("/login"),
    },
    {
      path: "address/new",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.CUSTOMER])
        ? LazyLoadRoutes("Address", "AddEditAddress")
        : AuthenticateRoute("/login"),
    },
    {
      path: "address/:id/edit",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.CUSTOMER])
        ? LazyLoadRoutes("Address", "AddEditAddress")
        : AuthenticateRoute("/login"),
    },
    {
      path: "settings",
      element: authSvc.canActivateRoute(RouteType.PRIVATE, [UserRoles.ADMIN])
        ? LazyLoadRoutes("Setting", "Settings")
        : AuthenticateRoute("/login"),
    },
  ];

  const routing = useRoutes(routes);

  return routing;
}
