import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityStatus, DateFormats } from "../../data/app.constant";
import { IVehicle } from "../../interfaces/vehicle.interface";
import { AppNotificationService } from "../../services/app-notification.service";
import { UtilService } from "../../services/util.service";
import { VehicleService } from "../../services/vehicle.service";
import BackButton from "../../shared/components/BackButton";
import ActivateDeactivateStatus from "../../shared/components/Common/ActivateDeactivateStatus";
import ActivityStatusChip from "../../shared/components/Common/ActivityStatusChip";
import VehicleSlider from "./components/VehicleSlider";

const VehicleDetails = () => {
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const vehicleSvc = new VehicleService();
  const utilSvc = new UtilService();

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    try {
      const response = await vehicleSvc.getSingleVehicle(id as string);
      setVehicle(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const updateStatus = async () => {
    try {
      const payload = {
        status: vehicle?.status === ActivityStatus.ACTIVE ? ActivityStatus.INACTIVE : ActivityStatus.ACTIVE,
      };
      await vehicleSvc.updateVehicleStatus(id as string, payload);
      loadVehicle();
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
          <Button variant="outlined" color="primary" startIcon={<CreateTwoToneIcon />} onClick={() => navigate(`/vehicles/${id}/edit`)}>
            Edit Vehicle
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader
          title="Vehicle Details"
          className="card-heading"
          action={vehicle ? <ActivateDeactivateStatus user={vehicle} moduleTextName="Vehicle" onClick={updateStatus} /> : null}
        />
        <Divider />
        {vehicle?._id ? (
          <CardContent>
            <div className={`row ${utilSvc.isMobile() ? "px-2" : "px-4"}`}>
              <div className="col-lg-6 col-md-12 col-sm-12 col-12 py-0">
                <VehicleSlider vehicle={vehicle} height={utilSvc.isMobile() ? "180px" : "350px"} />
              </div>
              <div className={`col-lg-6 col-md-12 col-sm-12 col-12 ${utilSvc.isMobile() ? "mt-4" : ""}`}>
                <div className={`row ${utilSvc.isMobile() ? "" : "ms-4"}`}>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Vehicle Number</p>
                    <p className="detail-value">{vehicle.vehicleNumber}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Status</p>
                    <p className="detail-value">
                      <ActivityStatusChip info={vehicle} verient="filled" />
                    </p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Vehicle Company</p>
                    <p className="detail-value">{vehicle.company}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Capacity</p>
                    <p className="detail-value">{vehicle.capacity}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Vehicle Type</p>
                    <p className="detail-value">{vehicle.vehicleType.name}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Manufacturing Year</p>
                    <p className="detail-value">{vehicle?.mfgYear ? utilSvc.formatDate(vehicle.mfgYear, DateFormats.MMMM_YYYY) : ""}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Chassis Number</p>
                    <p className="detail-value">{vehicle.chassisNumber}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label"> Registration Number</p>
                    <p className="detail-value">{vehicle.regNumber}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Created On</p>
                    <p className="detail-value">{utilSvc.formatDate(vehicle.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Updated On</p>
                    <p className="detail-value">{utilSvc.formatDate(vehicle.updatedAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
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

export default VehicleDetails;
