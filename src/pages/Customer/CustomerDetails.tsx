import CallTwoToneIcon from "@mui/icons-material/CallTwoTone";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountType, AccountTypeLabel, ActivityStatus, DateFormats } from "../../data/app.constant";
import { StatusColors } from "../../data/color.constant";
import { IUser } from "../../interfaces/user.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { CustomerService } from "../../services/customer.service";
import { UtilService } from "../../services/util.service";
import BackButton from "../../shared/components/BackButton";
import ActivateDeactivateStatus from "../../shared/components/Common/ActivateDeactivateStatus";
import AvatarImage from "../../shared/components/Common/AvatarImage";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";

const CustomerDetails = () => {
  const [customer, setCustomer] = useState<IUser | null>(null);
  const { id } = useParams();
  const notifySvc = new AppNotificationService();
  const customerSvc = new CustomerService();
  const utilSvc = new UtilService();

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    try {
      const response = await customerSvc.getSingleCustomer(id as string);
      setCustomer(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const updateStatus = async () => {
    try {
      const payload = {
        status: customer?.status === ActivityStatus.ACTIVE ? ActivityStatus.INACTIVE : ActivityStatus.ACTIVE,
      };
      await customerSvc.updateCustomerStatus(id as string, payload);
      loadCustomer();
    } catch (error) {
      notifySvc.showError(error);
    }
  };
  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader
          title="Customer Details"
          className="card-heading"
          action={customer ? <ActivateDeactivateStatus user={customer} moduleTextName="Customer" onClick={updateStatus} /> : null}
        />
        <Divider />
        {customer?._id ? (
          <CardContent>
            <div className={`row ${utilSvc.isMobile() ? "px-2" : "px-4"}`}>
              <div
                className="col-lg-4 col-md-5 col-sm-12 col-12 align-center border rounded p-4"
                style={{
                  background: `linear-gradient(0deg, #FFFFFF 45%, ${
                    customer.status === ActivityStatus.ACTIVE ? StatusColors.ACTIVE : StatusColors.INACTIVE
                  } 83%)`,
                }}
              >
                <div className="row">
                  <div className="col-12 align-center mb-4">
                    <AvatarImage imageUrl={customer.imageUrl} height={220} width={220} />
                  </div>
                  <div className="col-12 align-center">
                    <BootstrapTooltip title="Call">
                      <a href={`tel:${customer.contactNumber}`} className="me-3">
                        <Button variant="outlined" color="primary">
                          <CallTwoToneIcon />
                        </Button>
                      </a>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Message">
                      <a href={`sms:${customer.contactNumber}`} className="me-3">
                        <Button variant="outlined" color="secondary">
                          <ChatBubbleTwoToneIcon />
                        </Button>
                      </a>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Email">
                      <a href={`mailto:${customer.email}`}>
                        <Button variant="outlined" color="error">
                          <EmailTwoToneIcon />
                        </Button>
                      </a>
                    </BootstrapTooltip>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-7 col-sm-12 col-12 mt-4">
                <div className={`row ${utilSvc.isMobile() ? "" : "ms-4"}`}>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Name</p>
                    <p className="detail-value">{customer.name}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Email</p>
                    <p className="detail-value">{customer.email}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Contact Number</p>
                    <p className="detail-value">{customer.contactNumber}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Account Type</p>
                    <p className="detail-value">
                      {customer.accountType === AccountType.GOOGLE ? AccountTypeLabel.GOOGLE : AccountTypeLabel.LOCAL}
                    </p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Created On</p>
                    <p className="detail-value">{utilSvc.formatDate(customer.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Updated On</p>
                    <p className="detail-value">{utilSvc.formatDate(customer.updatedAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
};

export default CustomerDetails;
