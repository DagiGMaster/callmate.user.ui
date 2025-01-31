import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/RegistrationPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/home");
  };

  return (
    <div className="landing-page-container">
      <video className="video-background" autoPlay loop muted playsInline>
        <source src="/assets/video/bg3_420_930_.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>ברוכים הבאים לראש קטן גדול</h1>
        <p>כאן ניתן לקבל תספורת עבור גברים וילדים - כל סוגי התספורות</p>
        <button className="button" onClick={handleNavigation}>
          לחץ לקביעת תור
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
