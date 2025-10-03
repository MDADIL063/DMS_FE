import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DailyExpenseStatus, DateFormats, InternalStatusTypes, TripStatus, UserRoles } from "../../data/app.constant";
import { IDailyExpense } from "../../interfaces/daily-expense.interface";
import { IUser } from "../../interfaces/user.interface";
import { useAppSelector } from "../../redux/hooks";
import { AppNotificationService } from "../../services/app-notification.service";
import { DailyExpenseService } from "../../services/daily-expense.service";
import { UtilService } from "../../services/util.service";
import BackButton from "../../shared/components/BackButton";
import ActivateDeactivateStatus from "../../shared/components/Common/ActivateDeactivateStatus";
import ActivityStatusChip from "../../shared/components/Common/ActivityStatusChip";
import Currency from "../../shared/components/Common/Currency";
import ExternalLink from "../../shared/components/Common/ExternalLink";
import { ITrip } from "../../interfaces/trip.interface";
import { TripService } from "../../services/trip.service";
import GeoMap from "../../shared/components/GeoMap";
import AssignDriverToTrip from "./components/AssignDriverToTrip";
import AddTaskTwoToneIcon from "@mui/icons-material/AddTaskTwoTone";

const TripDetails = () => {
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [showDriverAssignDialog, setShowDriverAssignDialog] = useState<boolean>(false);
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const tripSvc = new TripService();
  const utilSvc = new UtilService();

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    try {
      const response = await tripSvc.getSingleTrip(id as string);
      setTrip(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const updateStatus = async () => {
    // try {
    //   const payload = {
    //     status: dailyExpense?.status === DailyExpenseStatus.PENDING ? DailyExpenseStatus.APPROVED : DailyExpenseStatus.PENDING,
    //   };
    //   await dailyExpenseSvc.updateDailyExpenseStatus(id as string, payload);
    //   loadDailyExpense();
    // } catch (error) {
    //   notifySvc.showError(error);
    // }
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-4">
          <BackButton />
        </div>
        <div className="col-8 text-end">
          {/* {dailyExpense?.status === DailyExpenseStatus.PENDING ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CreateTwoToneIcon />}
              onClick={() => navigate(`/daily-expenses/${id}/edit`)}
            >
              Edit Daily Expense
            </Button>
          ) : null} */}
        </div>
      </div>
      <Card>
        <CardHeader
          title="Trip Details"
          className="card-heading"
          action={
            trip && trip.status === TripStatus.NEW && loggedInUser.role === UserRoles.ADMIN ? (
              <Button variant="outlined" color="secondary" onClick={() => setShowDriverAssignDialog(true)}>
                <AddTaskTwoToneIcon fontSize="small" className="me-1" /> Assign Driver
              </Button>
            ) : null
          }
        />
        <Divider />
        {trip?._id ? (
          <CardContent>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Date</p>
                <p className="detail-value">{utilSvc.formatDate(trip.startDateTime, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Status</p>
                <p className="detail-value">
                  <ActivityStatusChip info={trip} verient="filled" statusType={InternalStatusTypes.TRIP_STATUS} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Vehicle</p>
                <p className="detail-value">
                  {trip.vehicle ? (
                    <>
                      {loggedInUser.role === UserRoles.ADMIN ? (
                        <ExternalLink path={`/vehicles/${trip?.vehicle?._id}`} text={trip.vehicle?.vehicleNumber} />
                      ) : (
                        <>
                          {trip.vehicle?.vehicleType?.name} - {trip.vehicle?.vehicleNumber}
                        </>
                      )}
                    </>
                  ) : null}
                </p>
              </div>
              {loggedInUser.role === UserRoles.ADMIN || loggedInUser.role === UserRoles.DRIVER ? (
                <>
                  <div className="col-lg-3 col-md-4 col-6 mb-4">
                    <p className="detail-label">Customer</p>
                    <p className="detail-value">
                      {trip.customer ? (
                        <>
                          {loggedInUser.role === UserRoles.ADMIN ? (
                            <ExternalLink path={`/customers/${trip?.customer?._id}`} text={trip.customer?.name} />
                          ) : (
                            <>{trip.customer?.name}</>
                          )}
                        </>
                      ) : null}
                    </p>
                  </div>
                </>
              ) : null}
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Item To Carry</p>
                <p className="detail-value">{trip.itemToCarry}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Capacity (kg)</p>
                <p className="detail-value">{trip.capacity}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Distance (km)</p>
                <p className="detail-value">{trip.distance}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Approx. Duration</p>
                <p className="detail-value">{trip.duration}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Price</p>
                <p className="detail-value">
                  <Currency value={Number(trip.price) || 0} />
                </p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Created On</p>
                <p className="detail-value">{utilSvc.formatDate(trip.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
              </div>
              <div className="col-lg-3 col-md-4 col-6 mb-4">
                <p className="detail-label">Updated On</p>
                <p className="detail-value">{utilSvc.formatDate(trip.updatedAt, DateFormats.DD_MM_YYYY_H_MM_A)}</p>
              </div>
              <div className="col-12 mb-4">
                <p className="detail-label">Description</p>
                <p className="detail-value">{trip.description}</p>
              </div>
              <div className="col-lg-6 col-md-12 col-12 mb-4">
                <p className="detail-label">Start Location</p>
                <p className="detail-value">{trip.startLocation.address}</p>
                <GeoMap lat={trip.startLocation.lat} lng={trip.startLocation.lng} />
              </div>
              <div className="col-lg-6 col-md-12 col-12 mb-4">
                <p className="detail-label">End Location</p>
                <p className="detail-value">{trip.endLocation.address}</p>
                <GeoMap lat={trip.endLocation.lat} lng={trip.endLocation.lng} />
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
      {showDriverAssignDialog ? <AssignDriverToTrip onClose={(value: boolean) => setShowDriverAssignDialog(false)} /> : null}
    </div>
  );
};

export default TripDetails;
