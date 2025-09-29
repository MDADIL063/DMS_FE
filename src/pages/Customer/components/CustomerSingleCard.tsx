import CallTwoToneIcon from "@mui/icons-material/CallTwoTone";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import { useEffect, useState } from "react";
import { MaterialColorsCode300 } from "../../../data/color.constant";
import { IUser } from "../../../interfaces/user.interface";
import { UtilService } from "../../../services/util.service";
import ActivityStatusChip from "../../../shared/components/Common/ActivityStatusChip";
import AvatarImage from "../../../shared/components/Common/AvatarImage";
import MenuActionsBtn from "../../../shared/components/Common/MenuActionsBtn";
import BootstrapTooltip from "../../../shared/components/Styled/BootstrapTooltip";
import GridItem from "../../../shared/components/Styled/GridItem";

interface IProps {
  customer: IUser;
}

const CustomerSingleCard = ({ customer }: IProps) => {
  const [backgroundColor, setBackgroundColor] = useState<string>("");

  useEffect(() => {
    setBackgroundColor(
      `linear-gradient(0deg, #FFFFFF 62%, ${
        MaterialColorsCode300[new UtilService().getRandomNumber(0, MaterialColorsCode300.length - 1)]
      } 40%)`
    );
  }, []);

  return (
    <GridItem
      style={{
        background: backgroundColor,
      }}
    >
      <div className="row pb-4">
        <div className="col-12 text-end mt-2 me-2">
          <MenuActionsBtn info={customer} path="/customers" hideEditBtn={true} hideDeleteBtn={true} />
        </div>
        <div className="col-12 align-center">
          <AvatarImage imageUrl={customer.imageUrl} height={100} width={100} />
        </div>
        <div className="col-12 align-center my-2">
          <p className="detail-label">{customer.name}</p>
        </div>
        <div className="col-12 align-center mb-2">
          <ActivityStatusChip info={customer} verient="filled" />
        </div>
        <div className="col-12 align-center">
          <BootstrapTooltip title="Call">
            <a href={`tel:${customer.contactNumber}`} className="me-3">
              <CallTwoToneIcon color="primary" />
            </a>
          </BootstrapTooltip>
          <BootstrapTooltip title="Message">
            <a href={`sms:${customer.contactNumber}`} className="me-3">
              <ChatBubbleTwoToneIcon color="info" />
            </a>
          </BootstrapTooltip>
          <BootstrapTooltip title="Email">
            <a href={`mailto:${customer.email}`}>
              <EmailTwoToneIcon color="error" />
            </a>
          </BootstrapTooltip>
        </div>
      </div>
    </GridItem>
  );
};

export default CustomerSingleCard;
