import { hideLoader, showLoader } from "../redux/slices/loader.slice";
import { useAppDispatch } from "../redux/hooks";

export class LoaderService {
  private appDespatch = useAppDispatch();

  showLoader() {
    this.appDespatch(showLoader());
  }

  hideLoader() {
    this.appDespatch(hideLoader());
  }
}
