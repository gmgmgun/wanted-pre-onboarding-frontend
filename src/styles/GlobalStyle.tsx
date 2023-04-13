import {createGlobalStyle, DefaultTheme} from "styled-components";
import reset from "styled-reset";

interface GlobalStyleProps {
  theme: DefaultTheme;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
    ${reset};

    * {
      box-sizing: border-box;
    }

    body {
      background-color: white;   
    }

    a, button {
      cursor: pointer;
    }
    
    a {
      text-decoration: none;
      color: black;
    }
    
    button {
      background-color : white;   
      border : none;
    }    
`;

export default GlobalStyle;
