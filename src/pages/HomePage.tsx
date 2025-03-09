import React from "react";
import "../css/HomePage.css";
import HaircutSlider from "../components/HaircutSlider";
import AppointmentScheduler from "../components/AppointmentScheduler";
import EccomerceGrid from "../components/EcommerceProductGrid";

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/assets/video/bg_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <HaircutSlider />
      <div className="home-section">
        <img src="/assets/images/LOGO-1.svg" />
        <span style={{ fontSize: "1.25rem" }}>
          לקביעת תור ניתן לחפש מועד פנוי כאן למטה
        </span>
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
        <EccomerceGrid />
      </div>
    </div>
  );
};

export default HomePage;
