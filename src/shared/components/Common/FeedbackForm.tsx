import React, { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, Rating, CircularProgress } from "@mui/material";
import { AppNotificationService } from "../../../services/app-notification.service";
import { IFeedback, IFeedbackPayload } from "../../../interfaces/feedBack.interface";
import { FeedBackService } from "../../../services/feedBack.service";

const FeedbackForm: React.FC<{ driverId: string; createdBy: string }> = ({ driverId, createdBy }) => {
  const feedbackSvc = new FeedBackService();
  const notifySvc = new AppNotificationService();

  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!rating) {
      notifySvc.showError("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const feedback: IFeedbackPayload = {
        driver: driverId,
        rating,
        comment,
      };
      await feedbackSvc.addFeedback(feedback);
      notifySvc.showSucces("Feedback submitted successfully");

      setRating(0);
      setComment("");
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
          <Typography variant="h5" align="center" gutterBottom>
            Driver Feedback
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="subtitle1">Rating:</Typography>
            <Rating
              name="driver-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
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
              fullWidth
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Submit Feedback"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedbackForm;
