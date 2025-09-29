import { API_URLS, LocalStorageKeys, RouteType, UserRoles } from "../data/app.constant";
import { IGoogleLoginCredentials, ILoginCredentials } from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.interface";
import { useAppSelector } from "../redux/hooks";
import { HttpService } from "./http.service";
import { StorageService } from "./storage.service";

export class AuthService {
  private httpSvc = new HttpService();
  private storageSvc = new StorageService();
  private loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  private token: string = useAppSelector((store) => store.token);

  async login(payload: ILoginCredentials) {
    const response = await this.httpSvc.post(API_URLS.LOGIN, payload);
    this.storageSvc.setItem(LocalStorageKeys.LOGGED_IN_USER, response.data.user);
    this.storageSvc.setItem(LocalStorageKeys.TOKEN, response.data.token);
    window.location.reload();
    return true;
  }

  async loginWithGoogle(payload: IGoogleLoginCredentials) {
    const response = await this.httpSvc.post(API_URLS.GOOGLE_LOGIN, payload);
    this.storageSvc.setItem(LocalStorageKeys.LOGGED_IN_USER, response.data.user);
    this.storageSvc.setItem(LocalStorageKeys.TOKEN, response.data.token);
    window.location.reload();
    return true;
  }

  async register(payload: FormData) {
    await this.httpSvc.post(API_URLS.REGISTER, payload);
    return true;
  }

  async logout() {
    await this.httpSvc.post(API_URLS.LOGOUT, {});
    this.storageSvc.removeItem(LocalStorageKeys.LOGGED_IN_USER);
    this.storageSvc.removeItem(LocalStorageKeys.TOKEN);
    window.location.reload();
    return true;
  }

  canActivateRoute(routeType: `${RouteType}`, roles: `${UserRoles}`[] = []): boolean {
    let canActivate: boolean = false;

    if (routeType === RouteType.PRIVATE) {
      if (roles?.length) {
        canActivate = this.loggedInUser?._id && this.token && roles.includes(this.loggedInUser.role) ? true : false;
      } else {
        canActivate = this.loggedInUser?._id && this.token ? true : false;
      }
    } else {
      canActivate = !this.loggedInUser?._id && !this.token ? true : false;
    }

    return canActivate;
  }
}
