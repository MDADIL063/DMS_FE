import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IProps {
  path?: string;
}

const BackButton = ({ path }: IProps) => {
  const navigate = useNavigate();

  const redirect = () => {
    if (path) {
      navigate(path);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button variant="outlined" color="inherit" startIcon={<ArrowBackTwoToneIcon />} onClick={redirect}>
      Back
    </Button>
  );
};

export default BackButton;
