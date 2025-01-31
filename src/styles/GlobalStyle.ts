import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    direction:rtl;
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
