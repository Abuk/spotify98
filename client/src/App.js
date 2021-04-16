import { useEffect, useState, useRef } from "react";
import Player from "./components/player/Player";
import Login from "./components/login/Login";
import { getLoginState, logout } from "./components/login/loginHelper";
import {
  loadPlayer,
  fetchDevices,
  fetchCurrentPlayback,
} from "./components/player/playerHelper";
import "98.css";
import "./App.css";
import Cookies from "js-cookie";

function App() {
  const [accessToken, setAccessToken] = useState(
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
      }, 1000);
    }
    return () => {
      clearInterval(pollTimer.current);
    };
  }, [accessToken]);

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
        {accessToken !== null ? (
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
              <div className="absolute inset-x-0 bottom-0 my-2 mx-2">
                <Player
                  device_id={device}
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
