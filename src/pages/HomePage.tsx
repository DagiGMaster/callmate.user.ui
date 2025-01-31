//

import React from "react";
import Header from "../components/Header";
import "../css/HomePage.css"; // Import the CSS file

const HomePage: React.FC = () => {
  const businessName = "My Hair Stylist";
  const avatarUrl = "/default-avatar.png"; // Replace with actual avatar logic

  const bookAppointment = () => {
    console.log("Booking appointment...");
    // Add logic to redirect to appointment booking flow
  };

  return (
    <div className="container">
      <Header businessName={businessName} avatarUrl={avatarUrl} />
      <div className="section">
        <h2>Welcome!</h2>
        <p>Click below to book your appointment with us.</p>
        <button className="button" onClick={bookAppointment}>
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default HomePage;
