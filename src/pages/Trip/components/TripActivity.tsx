import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { ITripActivity } from "../../../interfaces/trip-activity.interface";
import { UtilService } from "../../../services/util.service";
import { DateFormats } from "../../../data/app.constant";

interface Props {
  tripActivity: ITripActivity[];
}

const TripActivity = ({ tripActivity }: Props) => {
  const utilSvc = new UtilService();

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={tripActivity.length} alternativeLabel>
        {tripActivity.map((activity) => (
          <Step key={activity._id}>
            <StepLabel>
              <p>{activity.message}</p>
              <small>{utilSvc.formatDate(activity.createdAt, DateFormats.DD_MM_YYYY_H_MM_A)}</small>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TripActivity;
