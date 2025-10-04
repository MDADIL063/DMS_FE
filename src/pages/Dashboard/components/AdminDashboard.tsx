import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { DriverService } from "../../../services/driver.service";
import { VehicleService } from "../../../services/vehicle.service";
import Trips from "../../Trip/Trips";
import { TripService } from "../../../services/trip.service";
import { IUser } from "../../../interfaces/user.interface";
import { useAppSelector } from "../../../redux/hooks";

// import { TripService } from "../services/trip.service";

interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  activeVehicles: number;
  totalTrips: number;
  activeTrips: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  // const [recentTrips, setRecentTrips] = useState<any[]>([]);

  const driverSvc = new DriverService();
  const vehicleSvc = new VehicleService();
  const tripSvc = new TripService();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const driverCount = await driverSvc.getDriverCount();
      const vehicleCount = await vehicleSvc.getVehicleCount();
      const tripCount = await tripSvc.getTripCount();
      // const latestTrips = await tripSvc.getRecentTrips();

      setStats({
        totalDrivers: driverCount.total,
        activeDrivers: driverCount.active,
        totalVehicles: vehicleCount.total,
        activeVehicles: vehicleCount.active,
        totalTrips: tripCount.total,
        activeTrips: tripCount.new,
      });

      // setRecentTrips(latestTrips);
    } catch (error) {
      console.error("Error loading dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (title: string, total: number, active: number, color: string) => (
    <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: "bold" }}>
          {total}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Active: {active}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hi {loggedInUser.name}!
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          {renderStatCard("Drivers", stats?.totalDrivers || 0, stats?.activeDrivers || 0, "#1976d2")}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderStatCard("Vehicles", stats?.totalVehicles || 0, stats?.activeVehicles || 0, "#2e7d32")}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderStatCard("Trips", stats?.totalTrips || 0, stats?.activeTrips || 0, "#ed6c02")}
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Recent Trips
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Trips showingOnDashboard={true} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>Trip ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {recentTrips.length > 0 ? (
              recentTrips.map((trip) => (
                <TableRow key={trip._id}>
                  <TableCell>{trip._id}</TableCell>
                  <TableCell>{trip.customer?.name || "N/A"}</TableCell>
                  <TableCell>{trip.driver?.name || "N/A"}</TableCell>
                  <TableCell>{trip.startLocation}</TableCell>
                  <TableCell>{trip.endLocation}</TableCell>
                  <TableCell>{trip.status}</TableCell>
                  <TableCell>{new Date(trip.startDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : ( */}
            {/* <TableRow>
              <TableCell colSpan={7} align="center">
                No recent trips available
              </TableCell>
            </TableRow> */}
            {/* )} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
