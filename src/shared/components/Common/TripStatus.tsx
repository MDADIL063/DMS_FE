import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";

const steps = ["Trip Details", "Locations", "Vehicle", "Schedule & Review"];

const TripStatus = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Card sx={{ maxWidth: 800, margin: "20px auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create Trip
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        <Box minHeight={250}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Reason / Title" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Item to Carry" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Description" fullWidth multiline rows={3} />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Start Location" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="End Location" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    height: 180,
                    bgcolor: "#f6f6f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption">Map Preview (UI only)</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vehicle</InputLabel>
                  <Select defaultValue="">
                    <MenuItem value="">
                      <em>Select Vehicle</em>
                    </MenuItem>
                    <MenuItem value="v1">Vehicle 1 - TX1234</MenuItem>
                    <MenuItem value="v2">Vehicle 2 - TX5678</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Capacity" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Price (₹)" type="number" fullWidth />
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Start Date & Time" type="datetime-local" fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Estimated Duration" disabled fullWidth placeholder="Auto-calc" />
                </Grid>
              </Grid>

              <Box mt={3}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Review
                </Typography>
                <Typography variant="body2">Reason: Sample reason</Typography>
                <Typography variant="body2">Item: Luggage</Typography>
                <Typography variant="body2">From: Delhi</Typography>
                <Typography variant="body2">To: Mumbai</Typography>
                <Typography variant="body2">Vehicle: TX1234</Typography>
                <Typography variant="body2">Capacity: 20kg</Typography>
                <Typography variant="body2">Price: ₹500</Typography>
                <Typography variant="body2">Start: 05/10/2025, 10:00 AM</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary">
              Create Trip
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TripStatus;
