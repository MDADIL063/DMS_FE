import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { ITripActivity } from "../../../interfaces/trip-activity.interface";

interface Props {
  tripActivity: ITripActivity[];
}

const TripActivity = ({ tripActivity }: Props) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={tripActivity.length} alternativeLabel>
        {tripActivity.map((activity) => (
          <Step key={activity._id}>
            <StepLabel>{activity.message}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TripActivity;
