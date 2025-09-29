import { IUser } from "../../../interfaces/user.interface";

interface IProps {
  user: IUser;
}

const UserEmail = ({ user }: IProps) => {
  return (
    <>
      <a className="external-link" href={`mailto:${user.email}`}>
        {user.email}
      </a>
    </>
  );
};

export default UserEmail;
