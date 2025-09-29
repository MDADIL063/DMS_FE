import CallTwoToneIcon from "@mui/icons-material/CallTwoTone";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityStatus, DateFormats } from "../../data/app.constant";
import { StatusColors } from "../../data/color.constant";
import { IUser } from "../../interfaces/user.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { DriverService } from "../../services/driver.service";
import { UtilService } from "../../services/util.service";
import BackButton from "../../shared/components/BackButton";
import ActivateDeactivateStatus from "../../shared/components/Common/ActivateDeactivateStatus";
import AvatarImage from "../../shared/components/Common/AvatarImage";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";

const DriverDetails = () => {
  const [driver, setDriver] = useState<IUser | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const driverSvc = new DriverService();
  const utilSvc = new UtilService();

  useEffect(() => {
    loadDriver();
  }, []);

  const loadDriver = async () => {
    try {
      const response = await driverSvc.getSingleDriver(id as string);
      setDriver(response);
      console.log(response.licenseExpiryDate);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const updateStatus = async () => {
    try {
      const payload = {
        status: driver?.status === ActivityStatus.ACTIVE ? ActivityStatus.INACTIVE : ActivityStatus.ACTIVE,
      };
      await driverSvc.updateDriverStatus(id as string, payload);
      loadDriver();
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-6">
          <BackButton />
        </div>
        <div className="col-6 text-end">
          <Button variant="outlined" color="primary" startIcon={<CreateTwoToneIcon />} onClick={() => navigate(`/drivers/${id}/edit`)}>
            Edit Driver
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader
          title="Driver Details"
          className="card-heading"
          action={driver ? <ActivateDeactivateStatus user={driver} moduleTextName="Driver" onClick={updateStatus} /> : null}
        />
        <Divider />
        {driver?._id ? (
          <CardContent>
            <div className={`row ${utilSvc.isMobile() ? "px-2" : "px-4"}`}>
              <div
                className="col-lg-4 col-md-5 col-sm-12 col-12 align-center border rounded p-4"
                style={{
                  background: `linear-gradient(0deg, #FFFFFF 45%, ${
                    driver.status === ActivityStatus.ACTIVE ? StatusColors.ACTIVE : StatusColors.INACTIVE
                  } 83%)`,
                }}
              >
                <div className="row">
                  <div className="col-12 align-center mb-4">
                    <AvatarImage imageUrl={driver.imageUrl} height={220} width={220} />
                  </div>
                  <div className="col-12 align-center">
                    <BootstrapTooltip title="Call">
                      <a href={`tel:${driver.contactNumber}`} className="me-3">
                        <Button variant="outlined" color="primary">
                          <CallTwoToneIcon />
                        </Button>
                      </a>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Message">
                      <a href={`sms:${driver.contactNumber}`} className="me-3">
                        <Button variant="outlined" color="info">
                          <ChatBubbleTwoToneIcon />
                        </Button>
                      </a>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Email">
                      <a href={`mailto:${driver.email}`}>
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
                    <p className="detail-value">{driver.name}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Email</p>
                    <p className="detail-value">{driver.email}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Contact Number</p>
                    <p className="detail-value">{driver.contactNumber}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">License Number</p>
                    <p className="detail-value">{driver.licenseNumber}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">License Expiry Date</p>
                    <p className="detail-value">{driver?.licenseExpiryDate ? utilSvc.formatDate(driver.licenseExpiryDate) : null}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Created On</p>
                    <p className="detail-value">{utilSvc.formatDate(driver.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Updated On</p>
                    <p className="detail-value">{utilSvc.formatDate(driver.updatedAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
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

export default DriverDetails;
