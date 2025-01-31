import React from "react";
import "../css/HomePage.css";
import HaircutSlider from "../components/HaircutSlider";
import AppointmentScheduler from "../components/AppointmentScheduler";

const HomePage: React.FC = () => {
  const businessName = "My Hair Stylist";
  const avatarUrl = "/default-avatar.png"; // Replace with actual avatar logic

  const bookAppointment = () => {
    console.log("Booking appointment...");
  };

  return (
    <div className="container">
      <HaircutSlider />
      <div className="section">
        <img src="/assets/images/LOGO-1.svg" />
        <h4>לקביעת תור ניתן לחפש תור פנוי כאן למטה</h4>
        <div className="flashing-arrow">
          <svg width="50" height="50" viewBox="0 0 100 100">
            <polygon points="50,80 20,40 80,40" fill="black">
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="scale"
                values="1;1.3;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </polygon>
          </svg>
        </div>
        <AppointmentScheduler />
      </div>
    </div>
  );
};

export default HomePage;
