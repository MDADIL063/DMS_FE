import { ThemeProvider } from "@emotion/react";
import "cropperjs/dist/cropper.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useAppSelector } from "./redux/hooks";
import { RouterElement } from "./routes/Routes";
import Loader from "./shared/components/Loader";
import theme from "./utils/theme.utils";

const App = () => {
  const showLoader = useAppSelector((store) => store.loader);
  return (
    <ThemeProvider theme={theme}>
      <RouterElement />
      <ToastContainer />
      {showLoader ? <Loader /> : null}
    </ThemeProvider>
  );
};

export default App;
