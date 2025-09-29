import { Navigate } from "react-router-dom";

const AuthenticateRoute = (route: string) => {
  return <Navigate to={route} />;
};
export default AuthenticateRoute;
