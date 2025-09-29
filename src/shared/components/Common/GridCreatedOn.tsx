import { IUser } from "../../../interfaces/user.interface";
import { UtilService } from "../../../services/util.service";

interface IProps {
  info: IUser;
}

const GridCreatedOn = ({ info }: IProps) => {
  return <>{new UtilService().formatDate(info.createdAt)}</>;
};

export default GridCreatedOn;
