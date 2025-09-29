import { lazy, Suspense } from "react";
import Loader from "../shared/components/Loader";
import Header from "../shared/components/Header";
import { useAppSelector } from "../redux/hooks";
import { IUser } from "../interfaces/user.interface";

const LazyLoadRoutes = (moduleName: string, componentName: string) => {
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);

  const LazyElement = lazy(() => import(`../pages/${moduleName}/${componentName}.tsx`));

  // Wrapping around the suspense component is mandatory
  return (
    <Suspense fallback={<Loader />}>
      {loggedInUser?._id ? <Header /> : null}
      <LazyElement />
    </Suspense>
  );
};
export default LazyLoadRoutes;
