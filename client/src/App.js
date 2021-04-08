import { useEffect, useState, useCallback } from "react";
import Player from "./components/player/Player";
import Login from "./components/login/Login";
import { getLoginState, logout } from "./components/login/loginHelper";

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

  if (getLoginState()) {
    return (
      <div className="my-2 mx-2">
        <Player></Player>
        <button
          onClick={() => {
            setTimeout(200);
            handleUserLoginState(false);
            logout();
          }}
        >
          logout
        </button>
      </div>
    );
  } else return <Login></Login>;
}

export default App;
