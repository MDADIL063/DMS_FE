import React from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  path: string;
  text: string;
}

const ExternalLink = ({ path, text }: IProps) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <a className="text-primary text-decoration-none fw-bold" href="#" onClick={handleClick}>
      {text}
    </a>
  );
};

export default ExternalLink;
