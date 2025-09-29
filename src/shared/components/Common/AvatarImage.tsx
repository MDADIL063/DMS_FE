import { Avatar } from "@mui/material";

interface IProps {
  imageUrl?: string | null;
  height?: number;
  width?: number;
}

const AvatarImage = ({ imageUrl, height, width }: IProps) => {
  return (
    <>
      {imageUrl ? (
        <Avatar src={imageUrl} className="mt-1" sx={{ width: height || 40, height: width || 40 }} />
      ) : (
        <Avatar
          className="mt-1"
          sx={{ width: height || 40, height: width || 40 }}
          src="https://firebasestorage.googleapis.com/v0/b/hrs-uat.appspot.com/o/UI%2Fdefault-profile.png?alt=media&token=11f8d0c2-9d39-4721-a356-c872f6ee64fb"
        />
      )}
    </>
  );
};

export default AvatarImage;
