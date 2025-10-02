import { Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TripService } from "../../services/trip.service";
import { VehicleService } from "../../services/vehicle.service";
import { AppNotificationService } from "../../services/app-notification.service";
import BackButton from "../../shared/components/BackButton";
import GeoAddress from "../../shared/components/GeoAddress";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import { useDebouncedCallback } from "use-debounce";
import { UtilService } from "../../services/util.service";
import { IVehicle } from "../../interfaces/vehicle.interface";

interface ITripForm {
  reason: string;
  description: string;
  itemToCarry: string;
  capacity: number;
  vehicle: string;
  startLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  endLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number;
  duration: string;
  price: string;
  startDateTime: any;
}

const initialValues: ITripForm = {
  reason: "",
  description: "",
  itemToCarry: "",
  capacity: 0,
  vehicle: "",
  startLocation: {
    address: "Behind Veterinary College, A.B. Road, Borkhedi, Village Harsola, Indore - 453441, Madhya Pradesh, India",
    lat: 22.5794319,
    lng: 75.7937941,
  },
  endLocation: {
    address: "Behind Veterinary College, A.B. Road, Borkhedi, Village Harsola, Indore - 453441, Madhya Pradesh, India",
    lat: 22.5794319,
    lng: 75.7937941,
  },
  distance: 0,
  duration: "",
  startDateTime: dayjs().add(1, "minute"),
  price: "",
};

// Yup Validation Schema
const tripValidationSchema = Yup.object().shape({
  reason: Yup.string().required("Reason is required"),
  description: Yup.string().optional(),
  itemToCarry: Yup.string().required("Item to carry is required"),
  capacity: Yup.number().required("Capacity is required").min(1, "Capacity must be greater than 0"),
  vehicle: Yup.string().required("Vehicle is required"),
  startLocation: Yup.object()
    .nullable()
    .required("Start location is required")
    .shape({
      address: Yup.string().required("Start location address is required"),
      lat: Yup.number().required(),
      lng: Yup.number().required(),
    }),
  endLocation: Yup.object()
    .nullable()
    .required("End location is required")
    .shape({
      address: Yup.string().required("End location address is required"),
      lat: Yup.number().required(),
      lng: Yup.number().required(),
    }),
  distance: Yup.number().required("Distance is required").min(0, "Distance cannot be negative"),
  duration: Yup.string().optional(),
  startDateTime: Yup.date().required("Start date & time is required").min(dayjs().toDate(), "Start date & time cannot be in the past"),
});

const AddEditTrip = () => {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const tripSvc = new TripService();
  const vehicleSvc = new VehicleService();
  const notifySvc = new AppNotificationService();
  const utilSvc = new UtilService();
  const vehicleOriginalRef = useRef<IVehicle[]>([]);

  const { values, handleBlur, handleChange, handleSubmit, setFieldValue, errors, touched } = useFormik({
    initialValues,
    validationSchema: tripValidationSchema,
    onSubmit: async (vals) => {
      try {
        const payload = { ...vals, startDateTime: dayjs(vals.startDateTime).toISOString() };
        if (id) {
          payload.price = (values.distance * (vehicles.find((vehicle) => vehicle._id === values.vehicle)?.costPerKm || 0) || 0).toFixed(2);
          await tripSvc.updateTrip(id, payload);
          notifySvc.showSucces("Trip updated successfully");
        } else {
          payload.price = (values.distance * (vehicles.find((vehicle) => vehicle._id === values.vehicle)?.costPerKm || 0) || 0).toFixed(2);
          await tripSvc.addTrip(payload);
          notifySvc.showSucces("Trip created successfully");
        }
        navigate(-1);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    loadVehicles();
    if (id) {
      loadTrip();
    }
  }, []);

  const debouncedCapacityChange = useDebouncedCallback((value: number) => {
    // call your API or load function with updated capacity
    loadVehicles();
  }, 500);

  const loadVehicles = async () => {
    try {
      if (!vehicleOriginalRef.current.length) {
        const res = await vehicleSvc.getVehicles({ status: "Active" });
        vehicleOriginalRef.current = res.data;
      }
      setVehicles(vehicleOriginalRef.current.filter((vehicle) => vehicle.capacity >= values.capacity));
    } catch (err) {
      notifySvc.showError(err);
    }
  };

  const loadTrip = async () => {
    // Load trip details here if editing
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader title={id ? "Edit Trip" : "Add Trip"} className="card-heading" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Reason */}
              <div className="col-md-6 mt-4">
                <TextField
                  label="Reason"
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={!!errors.reason && !!touched.reason}
                  helperText={touched.reason && errors.reason}
                />
              </div>

              {/* Item to Carry */}
              <div className="col-md-6 mt-4">
                <TextField
                  label="Item to Carry"
                  name="itemToCarry"
                  value={values.itemToCarry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={!!errors.itemToCarry && !!touched.itemToCarry}
                  helperText={touched.itemToCarry && errors.itemToCarry}
                />
              </div>

              {/* Description */}
              <div className="col-md-12 mt-4">
                <TextField
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.description && !!touched.description}
                  helperText={touched.description && errors.description}
                />
              </div>

              {/* Capacity */}
              <div className="col-md-6 mt-4">
                <TextField
                  label="Capacity (kg)"
                  name="capacity"
                  type="number"
                  value={values.capacity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFieldValue("capacity", value); // update Formik state
                    debouncedCapacityChange(value); // trigger debounced API call
                  }}
                  onBlur={handleBlur}
                  fullWidth
                  error={!!errors.capacity && !!touched.capacity}
                  helperText={touched.capacity && errors.capacity}
                />
              </div>

              {/* Vehicle */}
              <div className="col-md-6 mt-4">
                <FormControl fullWidth error={!!errors.vehicle && !!touched.vehicle}>
                  <InputLabel>Vehicle</InputLabel>
                  <Select name="vehicle" label="Vehicle" value={values.vehicle} onChange={handleChange}>
                    <MenuItem value="">
                      <em>Select Vehicle</em>
                    </MenuItem>
                    {vehicles.map((v) => (
                      <MenuItem key={v._id} value={v._id}>
                        {v.vehicleType.name} - {v.vehicleNumber} ({v.capacity} kg)
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.vehicle && errors.vehicle && <small className="text-danger mt-1 fs-12">{errors.vehicle}</small>}
                </FormControl>
              </div>

              {/* Start Location */}
              <div className="col-md-6 mt-4">
                <GeoAddress
                  address={null}
                  fullAddressString={values.startLocation.address}
                  lat={values.startLocation.lat}
                  lng={values.startLocation.lng}
                  geoAddressChange={(address) => {
                    setFieldValue("startLocation", {
                      address: utilSvc.getFullAddress(address),
                      lat: address.lat,
                      lng: address.lng,
                    });
                    if (address.lat && address.lng && values.endLocation.lat && values.endLocation.lng) {
                      const distanceInKm = utilSvc.getDistanceFromLatLonInKm(
                        address.lat,
                        address.lng,
                        values.endLocation.lat,
                        values.endLocation.lng
                      );
                      setFieldValue("distance", distanceInKm);
                      setFieldValue("duration", utilSvc.getDurationFromDistance(distanceInKm));
                      const vehicle = vehicles.find((vehicle) => vehicle._id === values.vehicle);
                      setFieldValue("price", distanceInKm * (vehicle?.costPerKm || 0) || 0);
                    }
                  }}
                  addressLabel="Start Location"
                />
                {touched.startLocation && errors.startLocation && (
                  <small className="text-danger mt-1 fs-12">Please provide the start location</small>
                )}
              </div>
              {/* End Location */}
              <div className="col-md-6 mt-4">
                <GeoAddress
                  address={null}
                  fullAddressString={values.endLocation.address}
                  lat={values.endLocation.lat}
                  lng={values.endLocation.lng}
                  geoAddressChange={(address) => {
                    setFieldValue("endLocation", {
                      address: utilSvc.getFullAddress(address),
                      lat: address.lat,
                      lng: address.lng,
                    });
                    if (values.startLocation.lat && values.startLocation.lng && address.lat && address.lng) {
                      const distanceInKm = utilSvc.getDistanceFromLatLonInKm(
                        values.startLocation.lat,
                        values.startLocation.lng,
                        address.lat,
                        address.lng
                      );
                      setFieldValue("distance", distanceInKm);
                      setFieldValue("duration", utilSvc.getDurationFromDistance(distanceInKm));
                    }
                  }}
                  addressLabel="End Location"
                />
                {touched.endLocation && errors.endLocation && (
                  <small className="text-danger mt-1 fs-12">Please provide the end location</small>
                )}
              </div>

              {/* Distance */}
              <div className="col-md-6 mt-4">
                <TextField
                  label="Distance (km)"
                  name="distance"
                  type="number"
                  value={values.distance}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.distance && !!touched.distance}
                  helperText={touched.distance && errors.distance}
                  disabled
                />
              </div>

              {/* Duration */}
              <div className="col-md-6 mt-4">
                <TextField
                  label="Approx. Duration"
                  name="duration"
                  type="text"
                  value={values.duration}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.duration && !!touched.duration}
                  helperText={touched.duration && errors.duration}
                  disabled
                />
              </div>

              {/* Start DateTime */}
              <div className="col-md-6 mt-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    sx={{ width: "100%" }}
                    label="Start Date & Time"
                    value={values.startDateTime}
                    onChange={(val) => setFieldValue("startDateTime", val)}
                    minDateTime={dayjs()}
                  />
                </LocalizationProvider>
              </div>

              {/* Trip Price */}
              <div className="col-md-6 mt-4 text-end">
                <b>
                  Price:{" "}
                  <span style={{ color: "green" }}>
                    <CurrencyRupeeTwoToneIcon sx={{ fontSize: "16px" }} />
                    {(values.distance * (vehicles.find((vehicle) => vehicle._id === values.vehicle)?.costPerKm || 0) || 0).toFixed(2)}
                  </span>
                </b>
              </div>

              {/* Submit */}
              <div className="col-12 mt-4">
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  {id ? "Update Trip" : "Create Trip"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditTrip;
