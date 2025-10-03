import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography, Stack, CircularProgress } from "@mui/material";

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
    <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Driver Attendance
        </Typography>

        <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
          Current Status:
          <strong
            style={{
              color: status === "Available" ? "green" : status === "Off Duty" ? "red" : "gray",
            }}
          >
            {status}
          </strong>
        </Typography>
        {checkInTime ? (
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            CheckIn Time:
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
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            CheckOut Time:
            <strong
              style={{
                color: "gray",
              }}
            >
              {checkOutTime}
            </strong>
          </Typography>
        ) : null}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="success" disabled={loading || !!checkInTime} onClick={driverCheckIn}>
            {loading && !checkInTime ? <CircularProgress size={20} color="inherit" /> : "Check In"}
          </Button>

          <Button variant="contained" color="error" disabled={loading || !checkInTime || !!checkOutTime} onClick={driverCheckOut}>
            {loading && checkInTime && !checkOutTime ? <CircularProgress size={20} color="inherit" /> : "Check Out"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
    // </Box>
  );
};

export default CheckInCheckOut;
