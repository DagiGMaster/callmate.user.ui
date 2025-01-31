Guide to Build the callmate.user.ui Project
Below is a step-by-step guide to create the callmate.user.ui project based on your requirements:

1. Project Setup
Create a New React App
bash
Copy code
npx create-react-app callmate.user.ui --template typescript
cd callmate.user.ui
Install Required Dependencies
bash
Copy code
npm install mobx mobx-react-lite react-router-dom styled-components axios
Dependencies Explanation:

mobx and mobx-react-lite: State management.
react-router-dom: For routing (if needed in the future).
styled-components: For styling components.
axios: For API requests to microservices.
2. File Structure
Here's the recommended file structure for the project:

bash
Copy code
callmate.user.ui/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.tsx      # Header component
│   │   ├── Menu.tsx        # Hamburger menu component
│   ├── pages/
│   │   ├── HomePage.tsx    # Main page for user
│   ├── stores/
│   │   ├── userStore.ts    # MobX store for managing state
│   ├── styles/
│   │   ├── GlobalStyle.ts  # Global styles for the app
│   ├── App.tsx             # Main entry point
│   ├── index.tsx           # React entry point
├── .env                    # Environment variables
3. Implement the App
Global Styles
Create src/styles/GlobalStyle.ts:

typescript
Copy code
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    color: #333;
    overflow-x: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default GlobalStyle;
Header Component
Create src/components/Header.tsx:

typescript
Copy code
import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #0078d4;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 1.2rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Header: React.FC<{ businessName: string; avatarUrl: string }> = ({ businessName, avatarUrl }) => {
  return (
    <HeaderWrapper>
      <HamburgerButton>☰</HamburgerButton>
      <Title>{businessName}</Title>
      <Avatar src={avatarUrl} alt="Avatar" />
    </HeaderWrapper>
  );
};

export default Header;
Home Page
Create src/pages/HomePage.tsx:

typescript
Copy code
import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: auto;
`;

const Section = styled.div`
  padding: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #0078d4;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 1rem 0;

  &:hover {
    background-color: #005ea6;
  }
`;

const HomePage: React.FC = () => {
  const businessName = "My Hair Stylist";
  const avatarUrl = "/default-avatar.png"; // Replace with actual avatar logic

  const bookAppointment = () => {
    console.log("Booking appointment...");
    // Add logic to redirect to appointment booking flow
  };

  return (
    <Container>
      <Header businessName={businessName} avatarUrl={avatarUrl} />
      <Section>
        <h2>Welcome!</h2>
        <p>Click below to book your appointment with us.</p>
        <Button onClick={bookAppointment}>Book Appointment</Button>
      </Section>
    </Container>
  );
};

export default HomePage;
User Store
Create src/stores/userStore.ts:

typescript
Copy code
import { makeAutoObservable } from "mobx";

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: any) {
    this.user = user;
  }

  get isLoggedIn() {
    return !!this.user;
  }
}

const userStore = new UserStore();
export default userStore;
App Entry
Update src/App.tsx:

typescript
Copy code
import React from 'react';
import { observer } from 'mobx-react-lite';
import GlobalStyle from './styles/GlobalStyle';
import HomePage from './pages/HomePage';

const App: React.FC = observer(() => {
  return (
    <>
      <GlobalStyle />
      <HomePage />
    </>
  );
});

export default App;
4. Environment Configuration
Add .env file:

plaintext
Copy code
REACT_APP_API_GATEWAY_URL=http://localhost:5800
5. Test the App
Run the app:

bash
Copy code
npm start
6. Add Appointment Functionality
Add logic to send appointment data to the API Gateway when the user clicks "Book Appointment." Use Axios in HomePage.tsx:

typescript
Copy code
import axios from 'axios';

const bookAppointment = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY_URL}/appointments`, {
      clientName: "John Doe",
      phoneNumber: "+1234567890",
      appointmentDate: new Date().toISOString(),
      service: "Haircut",
      isDeleted: false,
      isPayed: false,
    });
    console.log("Appointment booked:", response.data);
  } catch (error) {
    console.error("Error booking appointment:", error);
  }
};
Next Steps
Product Section: Add a similar flow for product listing.
Admin UI: Once this is completed, we can start working on the admin UI.