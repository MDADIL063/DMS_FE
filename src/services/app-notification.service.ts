import { toast } from "react-toastify";
import { AppMessages, HttpStatus } from "../data/app.constant";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { removeLoggedInUser } from "../redux/slices/loggedInUser.slice";
import { removeToken } from "../redux/slices/token.slice";

export class AppNotificationService {
  private navigate = useNavigate();
  private appDispatch = useAppDispatch();

  showSucces(msg: string) {
    toast.success(msg, {
      autoClose: 2500,
      position: "bottom-right",
      theme: "colored",
      pauseOnHover: false,
    });
  }

  showError(error: any) {
    const msg: string = error?.response?.data?.message || error?.message || AppMessages.DEFAULT_ERROR;
    if (msg.includes("auth/popup-closed-by-user") || msg.includes("auth/cancelled-popup-request")) {
      return;
    }
    toast.error(msg, {
      autoClose: 2500,
      position: "bottom-right",
      theme: "colored",
      pauseOnHover: false,
    });
    if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
      this.appDispatch(removeLoggedInUser());
      this.appDispatch(removeToken());
      this.navigate("/login");
    }
  }
}
