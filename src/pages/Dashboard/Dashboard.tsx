import AdminDashboard from "./components/AdminDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import DriverDashboard from "./components/DriverDashboard";
import { UserRoles } from "../../data/app.constant";
import { IUser } from "../../interfaces/user.interface";
import { useAppSelector } from "../../redux/hooks";

const Dashboard = () => {
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  return (
    <>
      {loggedInUser?.role === UserRoles.ADMIN ? (
        <AdminDashboard />
      ) : loggedInUser?.role === UserRoles.DRIVER ? (
        <DriverDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </>
  );
};

export default Dashboard;
