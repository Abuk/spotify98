import { useEffect, useState, useCallback } from "react";
import Player from "./components/player/Player";
import Login from "./components/login/Login";
import { getLoginState, logout } from "./components/login/loginHelper";
import "98.css";

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
    <div className="h-full min-h-full w-100">
      <div className="window h-screen">
        <div className="title-bar">
          <div class="title-bar-text">play98</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body min-w-screen">
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
              <div className="absolute inset-x-0 bottom-0">
                <Player></Player>
              </div>
            </div>
          ) : (
            <Login></Login>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
