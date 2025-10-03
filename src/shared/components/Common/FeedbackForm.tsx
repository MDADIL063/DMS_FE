import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, Rating, CircularProgress } from "@mui/material";
import { AppNotificationService } from "../../../services/app-notification.service";
import { IFeedback, IFeedbackPayload } from "../../../interfaces/feedBack.interface";
import { FeedBackService } from "../../../services/feedBack.service";
import { ITrip } from "../../../interfaces/trip.interface";
import { IUser } from "../../../interfaces/user.interface";
import { useAppSelector } from "../../../redux/hooks";
import { UserRoles } from "../../../data/app.constant";

const FeedbackForm: React.FC<{ trip: ITrip }> = ({ trip }) => {
  const loggedInUser: IUser = useAppSelector((store) => store.loggedInUser);
  const feedbackSvc = new FeedBackService();
  const notifySvc = new AppNotificationService();

  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackID, setFeedbackID] = useState<string>("");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await feedbackSvc.getFeedbackByTrip(trip._id);
      if (response?._id) {
        setComment(response.comment || "");
        setRating(response.rating || 0);
        setFeedbackID(response._id as string);
      }
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      notifySvc.showError("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      if (feedbackID) {
        await feedbackSvc.updateFeedback(feedbackID, {
          rating,
          comment,
        });
      } else {
        const feedback: IFeedbackPayload = {
          driver: trip.driver._id as string,
          trip: trip._id,
          rating,
          comment,
        };
        await feedbackSvc.addFeedback(feedback);
      }
      notifySvc.showSucces("Feedback submitted successfully");
      loadFeedback();
      // setRating(0);
      // setComment("");
    } catch (error) {
      notifySvc.showError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" bgcolor="#f5f5f5" p={2}>
      <Card sx={{ width: 400, borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1">Rating:</Typography>
            {/* <Rating name="half-rating-read" defaultValue={2.2} precision={0.5} readOnly /> */}
            <Rating
              name="driver-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              disabled={loggedInUser.role === UserRoles.DRIVER || loggedInUser.role === UserRoles.ADMIN}
              sx={{
                "& .MuiRating-icon": {
                  fontSize: "30px", // increase star size
                },
              }}
            />

            <TextField
              label="Comment"
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loggedInUser.role === UserRoles.DRIVER || loggedInUser.role === UserRoles.ADMIN}
              fullWidth
            />

            {loggedInUser.role === UserRoles.CUSTOMER ? (
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : "Submit Feedback"}
              </Button>
            ) : null}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedbackForm;
