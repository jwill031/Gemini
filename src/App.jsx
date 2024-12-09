import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import { ThemeContext } from "./ThemeContext";

const App = () => {
  return (
    <>
        <Sidebar />
        <Main />
    </>
  );
};

export default App;
