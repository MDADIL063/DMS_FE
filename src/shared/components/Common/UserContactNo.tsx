import { IUser } from "../../../interfaces/user.interface";

interface IProps {
  user: IUser;
}

const UserContactNo = ({ user }: IProps) => {
  return (
    <>
      <a className="external-link" href={`tel:${user.contactNumber}`}>
        {user.contactNumber}
      </a>
    </>
  );
};

export default UserContactNo;
