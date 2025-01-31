import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import GlobalStyle from "./styles/GlobalStyle";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";

const App: React.FC = observer(() => {
  const [showRegister, setShowRegister] = useState(true); // Boolean state to toggle views

  return (
    <>
      <GlobalStyle />
      {showRegister ? <RegistrationPage /> : <HomePage />}
    </>
  );
});

export default App;
