import React from "react";
import FeedbackForm from "../../../shared/components/Common/FeedbackForm";
import FeedbackList from "../../../shared/components/Common/FeedBackList";
import AddTrip from "../../Trip/AddTrip";

const CustomerDashboard = () => {
  return (
    <div>
      {/* <FeedbackForm driverId="68ce65863186a80707668021" createdBy="6510abcd1234ef56789a7777" />
      <FeedbackList driverId="68ce65863186a80707668021" /> */}
      <AddTrip />
    </div>
  );
};

export default CustomerDashboard;
