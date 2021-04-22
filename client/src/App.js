import { useEffect, useState, useRef } from "react";
import Player from "./components/player/Player";
import Login from "./components/login/Login";
import LeftNav from "./components/views/LeftNav";
import Playlist from "./components/views/Playlist";
import {
  getLoginState,
  logout,
  refreshAccessToken,
} from "./components/login/loginHelper";
import {
  loadPlayer,
  fetchDevices,
  fetchCurrentPlayback,
} from "./components/player/playerHelper";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "98.css";
import "./App.css";
import Cookies from "js-cookie";

function App() {
  const [accessToken] = useState(
    getLoginState ? Cookies.get("access_token") : null
  );
  const [currentDevice, setCurrentDevice] = useState(0);
  const [device, setDevice] = useState(0);
  const [playbackState, setPlaybackState] = useState(undefined);

  const currentDeviceRef = useRef(currentDevice);
  const deviceRef = useRef(device);

  const pollTimer = useRef();

  const handleCurrentDevice = (data) => {
    currentDeviceRef.current = data;
    setCurrentDevice(data);
  };
  const handleDevice = (data) => {
    deviceRef.current = data;
    setDevice(data);
  };

  useEffect(() => {
    if (accessToken != null) {
      pollTimer.current = setInterval(() => {
        fetchCurrentPlayback().then((res) => {
          setPlaybackState(res);
        });
        fetchDevices().then((res) => {
          var hasBeenSetActive = false;
          res.devices.forEach((dev) => {
            if (dev.is_active) {
              handleCurrentDevice(dev);
              hasBeenSetActive = true;
            }
          });
          if (!hasBeenSetActive) {
            res.devices.forEach((dev) => {
              if (device.id === dev.id) handleCurrentDevice(dev);
            });
          }
        });
      }, 1000);
    } else {
      if (typeof Cookies.get("refresh_token") !== "undefined") {
        refreshAccessToken();
      }
    }
    console.log(accessToken);
    return () => {
      clearInterval(pollTimer.current);
    };
  }, [accessToken]);

  // useEffect(() => {
  //   console.log(playbackState);
  // }, [playbackState]);

  useEffect(() => {
    let isMounted = true;
    if (accessToken !== null) {
      loadPlayer().then(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: "spotify98",
            getOAuthToken: (cb) => {
              cb(accessToken);
            },
            volume: 0.5,
          });

          player.addListener("initialization_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("authentication_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("account_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("playback_error", ({ message }) => {
            console.error(message);
          });

          player.addListener("player_state_changed", (state) => {
            console.log(state);
            if (isMounted) {
              fetchDevices().then((res) => {
                res.devices.forEach((device) => {
                  if (device.is_active) {
                    handleCurrentDevice(device);
                  }
                });
              });
            }
          });

          // Ready
          player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            if (isMounted) {
              handleDevice(device_id);
            }
          });

          // Not Ready
          player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });
          console.log(player.connect());
        };
      });
    }
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

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
        {typeof accessToken !== "undefined" ? (
          typeof playbackState === "undefined" ? (
            <div>Loading</div>
          ) : (
            <div className="">
              <button
                onClick={() => {
                  setTimeout(200);
                  logout();
                }}
              >
                logout
              </button>
              <Router>
                <div className="flex">
                  <LeftNav />
                  <Switch>
                    <Route
                      path="/playlist/:id"
                      children={<Playlist current_device={device} />}
                    />
                    <Route path="/"></Route>
                  </Switch>
                </div>
              </Router>
              <div className="absolute inset-x-0 bottom-0 my-2 mx-2">
                <Player
                  this_device={device}
                  current_device={currentDevice}
                  playback_state={playbackState}
                ></Player>
              </div>
            </div>
          )
        ) : (
          <Login></Login>
        )}
      </div>
    </div>
  );
}

export default App;
