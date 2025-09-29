// import React, { useEffect, useState } from "react";
// import { Box, Card, CardContent, Typography, Rating, CircularProgress, Divider } from "@mui/material";
// import { FeedBackService } from "../../../services/feedBack.service";
// import { IFeedback } from "../../../interfaces/feedBack.interface";

// const FeedbackList: React.FC<{ driverId: string }> = ({ driverId }) => {
//   const feedbackSvc = new FeedBackService();
//   const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     loadFeedback();
//   }, []);

//   const loadFeedback = async () => {
//     try {
//       const data = await feedbackSvc.getFeedbackByDriver(driverId);
//       setFeedbacks(data);
//     } catch (err) {
//       console.error("Error loading feedbacks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" p={2}>
//       <Typography variant="h5" gutterBottom>
//         Driver Feedbacks
//       </Typography>
//       {feedbacks.length === 0 ? (
//         <Typography>No feedback found for this driver.</Typography>
//       ) : (
//         feedbacks.map((fb) => (
//           <Card key={fb._id} sx={{ width: "100%", maxWidth: 500, mb: 2, borderRadius: 2, boxShadow: 3 }}>
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight="bold">
//                 Rating:
//               </Typography>
//               <Rating value={fb.rating} readOnly sx={{ "& .MuiRating-icon": { fontSize: "28px" } }} />
//               {fb.comment && (
//                 <>
//                   <Divider sx={{ my: 1 }} />
//                   <Typography variant="body1">{fb.comment}</Typography>
//                 </>
//               )}
//               <Typography variant="caption" display="block" color="text.secondary" mt={1}>
//                 {new Date(fb.createdAt || "").toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </Box>
//   );
// };

// export default FeedbackList;
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { FeedBackService } from "../../../services/feedBack.service";
import { AppNotificationService } from "../../../services/app-notification.service";
import { IFeedback } from "../../../interfaces/feedBack.interface";

const FeedBackList: React.FC<{ driverId: string }> = ({ driverId }) => {
  const feedbackSvc = new FeedBackService();
  const notifySvc = new AppNotificationService();

  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const res = await feedbackSvc.getFeedbackByDriver(driverId);
      setFeedbacks(res);
    } catch (error) {
      notifySvc.showError("Failed to load feedbacks");
    }
  };

  const handleEditClick = (feedback: IFeedback) => {
    setSelectedFeedback(feedback);
    setRating(feedback.rating);
    setComment(feedback.comment || "");
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedFeedback) return;

    try {
      const updated = await feedbackSvc.updateFeedback(selectedFeedback._id!, {
        rating,
        comment,
      });

      setFeedbacks((prev) => prev.map((fb) => (fb._id === updated._id ? updated : fb)));

      notifySvc.showSucces("Feedback updated successfully");
      handleClose();
    } catch (error) {
      notifySvc.showError("Failed to update feedback");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeedback(null);
    setRating(0);
    setComment("");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      {feedbacks.map((fb) => (
        <Card key={fb._id} sx={{ width: "100%", maxWidth: 500, mb: 2, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                Rating:
              </Typography>
              <IconButton onClick={() => handleEditClick(fb)}>
                <EditIcon />
              </IconButton>
            </Box>

            <Rating value={fb.rating} readOnly />

            <Typography variant="body2" color="text.secondary" mt={1}>
              {fb.comment || "No comment"}
            </Typography>

            {fb.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Updated: {new Date(fb.updatedAt).toLocaleString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      {open ? (
        <FeedbackEditForm
          setRating={setRating}
          rating={rating}
          comment={comment}
          setComment={setComment}
          handleClose={handleClose}
          handleUpdate={handleUpdate}
        />
      ) : null}
    </Box>
  );
};

const FeedbackEditForm = ({ setRating, rating, comment, setComment, handleClose, handleUpdate }: any) => {
  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Feedback</DialogTitle>
      <DialogContent>
        <Typography>Update your rating:</Typography>
        <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        <TextField
          margin="dense"
          label="Comment"
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedBackList;
