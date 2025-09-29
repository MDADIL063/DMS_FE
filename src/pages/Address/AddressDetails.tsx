import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import WhereToVoteTwoToneIcon from "@mui/icons-material/WhereToVoteTwoTone";
import { Button, Card, CardContent, CardHeader, Chip } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppMessages, DateFormats } from "../../data/app.constant";
import { IAddress } from "../../interfaces/address.interface";
import { AddressService } from "../../services/address.service";
import { AppNotificationService } from "../../services/app-notification.service";
import { UtilService } from "../../services/util.service";
import BackButton from "../../shared/components/BackButton";
import GeoMap from "../../shared/components/GeoMap";
import BootstrapTooltip from "../../shared/components/Styled/BootstrapTooltip";

const AddressDetails = () => {
  const [address, setAddress] = useState<IAddress | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const addressSvc = new AddressService();
  const utilSvc = new UtilService();

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    try {
      const response = await addressSvc.getSingleAddress(id as string);
      setAddress(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const makePrimary = async () => {
    try {
      await addressSvc.makeAddressPrimary(id as string);
      notifySvc.showSucces(AppMessages.ADDRESS_MADE_PRIMARY);
      loadAddress();
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
          <Button variant="outlined" color="primary" startIcon={<CreateTwoToneIcon />} onClick={() => navigate(`/address/${id}/edit`)}>
            Edit Address
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader
          title="Address Details"
          className="card-heading"
          action={
            !address?.isPrimary ? (
              <BootstrapTooltip title="Make Primary Address">
                <Button variant="outlined" color="success" onClick={makePrimary}>
                  <WhereToVoteTwoToneIcon className="me-2" /> Make Primary
                </Button>
              </BootstrapTooltip>
            ) : null
          }
        />
        <Divider />
        {address?._id ? (
          <CardContent>
            <div className={`row ${utilSvc.isMobile() ? "px-2" : "px-4"}`}>
              <div className="col-lg-5 col-md-4 col-sm-12 col-12 py-0 align-center">
                {address.lat && address.lng ? (
                  <GeoMap lat={address.lat} lng={address.lng} disableClick={true} height={utilSvc.isMobile() ? "250px" : "375px"} />
                ) : (
                  <>
                    <small>
                      <i>Map view is not available for this address. Edit and point your location on map. </i>
                    </small>
                  </>
                )}
              </div>
              <div className={`col-lg-7 col-md-8 col-sm-12 col-12 ${utilSvc.isMobile() ? "mt-4" : ""}`}>
                <div className={`row ${utilSvc.isMobile() ? "" : "ms-4"}`}>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Name</p>
                    <p className="detail-value">{address.name}</p>
                  </div>
                  <div className="col-6 mb-4 pt-3">
                    {address.isPrimary ? <Chip variant="filled" color="success" size="small" label="Primary" /> : null}
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">House/Godown Number</p>
                    <p className="detail-value">
                      <p className="detail-value">{address.flatNo}</p>
                    </p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Street Name</p>
                    <p className="detail-value">{address.streetName}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Area</p>
                    <p className="detail-value">{address.area}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Pincode</p>
                    <p className="detail-value">{address.pincode}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">City</p>
                    <p className="detail-value">{address.city}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">State</p>
                    <p className="detail-value">{address.state}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Created On</p>
                    <p className="detail-value">{utilSvc.formatDate(address.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
                  </div>
                  <div className="col-6 mb-4">
                    <p className="detail-label">Updated On</p>
                    <p className="detail-value">{utilSvc.formatDate(address.updatedAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
                  </div>
                  <div className="col-12 mb-4">
                    <p className="detail-label">Full Address</p>
                    <p className="detail-value">{utilSvc.getFullAddress(address)}</p>
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

export default AddressDetails;
