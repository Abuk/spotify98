import { useEffect, useState } from "react";
import Player from "./components/Player";
import Login from "./components/Login";
import { getLoginState } from "./tools/login";

function App() {
  const [userLoginState, setUserLoginState] = useState(false);

  useEffect(() => {
    setUserLoginState(getLoginState());
  }, [userLoginState]);

  if (getLoginState()) return <Player></Player>;
  else return <Login></Login>;
}

export default App;
