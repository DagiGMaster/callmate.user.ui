// import React, { useState } from "react";

// interface RegistrationPageProps {
//   onBackToApp: () => void;
// }

// const RegistrationPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form Data Submitted:", formData);
//   };

//   return (
//     <div style={{ margin: "0 auto", padding: "5rem 0.25rem" }}>
//       <h2 style={{ marginBottom: "2rem" }}>הרשמה</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "1.5rem" }}>
//           <label htmlFor="name">שם פרטי</label>
//           <p>(חובה)</p>
//           <input
//             type="name"
//             id="firstName"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             style={{
//               display: "block",
//               width: "100%",
//               padding: "8px",
//               marginTop: "5px",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "1.5rem" }}>
//           <label htmlFor="name">שם משפחה</label>
//           <p>(חובה)</p>
//           <input
//             type="name"
//             id="firstName"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             style={{
//               display: "block",
//               width: "100%",
//               padding: "8px",
//               marginTop: "5px",
//             }}
//           />
//         </div>
//         <div style={{ marginBottom: "1.5rem" }}>
//           <label htmlFor="phone">טלפון</label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             style={{
//               display: "block",
//               width: "100%",
//               padding: "8px",
//               marginTop: "5px",
//             }}
//           />
//         </div>
//         <button
//           type="submit"
//           style={{
//             backgroundColor: "#007BFF",
//             color: "#FFF",
//             padding: "10px",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           הרשמה
//         </button>
//       </form>
//       {/* Button to go back to the App */}
//     </div>
//   );
// };

// export default RegistrationPage;

// import React from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate(); // React Router's navigation hook

//   const handleNavigation = () => {
//     navigate("/home"); // Navigate to the HomePage route
//   };
//   return (
//     <LandingPageContainer>
//       <VideoBackground autoPlay loop muted playsInline>
//         <source src="/assets/video/bg3_420_930_.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </VideoBackground>
//       <Content>
//         <h1>ברוכים הבאים לראש קטן גדול</h1>
//         <p>כאן ניתן לקבל תספורת עבור גברים וילדים - כל סוגי התספורות</p>
//         <Button onClick={handleNavigation}>לחץ לקביעת תור</Button>
//       </Content>
//     </LandingPageContainer>
//   );
// };

// export default LandingPage;

// // Styled Components
// const LandingPageContainer = styled.div`
//   position: relative;
//   width: 100%;
//   height: 100vh;
//   overflow: hidden;
// `;

// const VideoBackground = styled.video`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   z-index: -1;
// `;

// const Content = styled.div`
//   position: relative;
//   color: white;
//   text-align: center;
//   top: 90%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   padding: 1rem 0 1rem 0;
//   background-color: rgba(0, 0, 0, 0.6);
// `;

// const Button = styled.button`
//   background-color: #74ad45;
//   color: white;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 1.25rem;
//   font-weight: 700;
//   margin-top: 20px;
//   &:hover {
//     background-color: #0056b3;
//   }
// `;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css"; // Import the CSS file

const LandingPage: React.FC = () => {
  const navigate = useNavigate(); // React Router's navigation hook

  const handleNavigation = () => {
    navigate("/home"); // Navigate to the HomePage route
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
