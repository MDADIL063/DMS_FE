import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography, Stack, CircularProgress, Chip } from "@mui/material";

import { AttendanceService } from "../../../services/attendance.service";
import { AppMessages, DateFormats, DriverAvailabilityStatus } from "../../../data/app.constant";
import { UtilService } from "../../../services/util.service";
import { AppNotificationService } from "../../../services/app-notification.service";

const CheckInCheckOut: React.FC = () => {
  const driverAvailabilitySVC = new AttendanceService();
  const utilSvc = new UtilService();
  const notifySvc = new AppNotificationService();
  const [status, setStatus] = useState<string>("Inactive");
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string>("");
  const [checkOutTime, setCheckOutTime] = useState<string>("");

  useEffect(() => {
    loadDriverTodaysAvailability();
  }, []);

  const loadDriverTodaysAvailability = async () => {
    try {
      let response = await driverAvailabilitySVC.driverTodaysAvailability();
      if (response.success) {
        console.log(response?.data.checkInTime);
        if (response?.data?.checkInTime) {
          let date = utilSvc.formatDate(response.data.checkInTime, DateFormats.DD_MM_YYYY_H_MM_A);
          setCheckInTime(date);
        }
        if (response?.data?.checkOutTime) {
          let date = utilSvc.formatDate(response.data.checkOutTime, DateFormats.DD_MM_YYYY_H_MM_A);
          setCheckOutTime(date);
        }

        setStatus(response?.data?.status || "Inactive");
      }
    } catch (err) {
      notifySvc.showError("");

      console.log(err);
    }
  };

  // ✅ Check-In function
  const driverCheckIn = async () => {
    setLoading(true);
    try {
      let response = await driverAvailabilitySVC.driverCheckIn();
      setStatus(response.status || DriverAvailabilityStatus.AVAILABLE);

      notifySvc.showSucces(AppMessages.CHECK_IN);
      loadDriverTodaysAvailability();
    } catch (error: any) {
      notifySvc.showError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check-Out function
  const driverCheckOut = async () => {
    setLoading(true);
    try {
      let response = await driverAvailabilitySVC.driverCheckOut();
      setStatus(response.status || DriverAvailabilityStatus.OFF_DUTY);
      notifySvc.showSucces(AppMessages.CHECK_OUT);
      loadDriverTodaysAvailability();
    } catch (error: any) {
      notifySvc.showError(error);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <Box>
    <Card sx={{ borderRadius: 3, boxShadow: 4, minHeight: "141px" }}>
      <CardContent>
        <div className="row">
          <div className="col-6 ">
            <Typography variant="h6" gutterBottom>
              Today Attendance
            </Typography>
          </div>
          <div className="col-6 text-end">
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              {status === DriverAvailabilityStatus.AVAILABLE ? (
                <Chip variant="filled" color="success" size="small" label={DriverAvailabilityStatus.AVAILABLE} />
              ) : null}
              {status === DriverAvailabilityStatus.INACTIVE ? (
                <Chip variant="filled" color="error" size="small" label={DriverAvailabilityStatus.INACTIVE} />
              ) : null}
              {status === DriverAvailabilityStatus.ON_TRIP ? (
                <Chip variant="filled" color="primary" size="small" label={DriverAvailabilityStatus.ON_TRIP} />
              ) : null}
              {status === DriverAvailabilityStatus.OFF_DUTY ? (
                <Chip variant="filled" color="error" size="small" label={DriverAvailabilityStatus.OFF_DUTY} />
              ) : null}
            </Typography>
          </div>

          <div className="col-7">
            {checkInTime ? (
              <Typography variant="body2" sx={{ mb: 3 }}>
                Check In Time:{" "}
                <strong
                  style={{
                    color: "gray",
                  }}
                >
                  {checkInTime}
                </strong>
              </Typography>
            ) : null}
            {checkOutTime ? (
              <Typography variant="body2" sx={{ mb: 3 }}>
                Check Out Time:{" "}
                <strong
                  style={{
                    color: "gray",
                  }}
                >
                  {checkOutTime}
                </strong>
              </Typography>
            ) : null}
          </div>

          <div className="col-5 text-end">
            <Stack direction="row" spacing={2} justifyContent="end">
              {!checkInTime ? (
                <Button variant="contained" color="success" disabled={loading || !!checkInTime} onClick={driverCheckIn}>
                  {loading && !checkInTime ? <CircularProgress size={20} color="inherit" /> : "Check In"}
                </Button>
              ) : null}

              {checkInTime && !checkOutTime ? (
                <Button variant="contained" color="error" disabled={loading || !checkInTime || !!checkOutTime} onClick={driverCheckOut}>
                  {loading && checkInTime && !checkOutTime ? <CircularProgress size={20} color="inherit" /> : "Check Out"}
                </Button>
              ) : null}

              {checkInTime && checkOutTime ? (
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Working Hours
                  <br />
                  <strong
                    style={{
                      color: "gray",
                    }}
                  >
                    {utilSvc.getWorkingDuration(checkInTime, checkOutTime)}
                  </strong>
                </Typography>
              ) : null}
            </Stack>
          </div>
        </div>
      </CardContent>
    </Card>
    // </Box>
  );
};

export default CheckInCheckOut;
