import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ToDo from "./pages/ToDo";
import GlobalStyle from "./styles/GlobalStyle";

function Router() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/signup" element={<SignUp inputData={INPUT_DATA} />} />
        <Route path="/signin" element={<SignIn inputData={INPUT_DATA} />} />
        <Route path="/todo" element={<ToDo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

const INPUT_DATA = [
  {
    id: 0,
    name: "userId",
    type: "text",
    placeholder: "아이디",
    infoText: "아이디를 입력해주세요.",
    autoFocus: true,
  },
  {
    id: 1,
    name: "userPw",
    type: "password",
    placeholder: "비밀번호",
    infoText: "비밀번호를 입력해주세요.",
    autoFocus: false,
  },
];
