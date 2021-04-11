import { useEffect, useState, useCallback } from "react";
import Player from "./components/player/Player";
import Login from "./components/login/Login";
import { getLoginState, logout } from "./components/login/loginHelper";
import "98.css";
import "./App.css";

function App() {
  const [userLoginState, setUserLoginState] = useState(false);
  const handleUserLoginState = useCallback((state) => {
    setUserLoginState(state);
  }, []);

  useEffect(() => {
    console.log(userLoginState);
  }, [userLoginState]);

  useEffect(() => {
    if (getLoginState()) handleUserLoginState(true);
  }, [handleUserLoginState]);

  return (
    <div className="window my-2 mx-2 h-custom w-custom">
      <div className="title-bar ">
        <div className="title-bar-text">play98</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body my-0 mx-0">
        {getLoginState() ? (
          <div className="">
            <button
              onClick={() => {
                setTimeout(200);
                handleUserLoginState(false);
                logout();
              }}
            >
              logout
            </button>
            <div className="absolute inset-x-0 bottom-0 my-2 mx-2">
              <Player></Player>
            </div>
          </div>
        ) : (
          <Login></Login>
        )}
      </div>
    </div>
  );
}

export default App;
