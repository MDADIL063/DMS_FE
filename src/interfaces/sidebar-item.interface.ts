import { UserRoles } from "../data/app.constant";

export interface ISidebarItem {
  name: string;
  path: string;
  roles: `${UserRoles}`[];
  iconComp: any;
  isConfigration: boolean;
}
