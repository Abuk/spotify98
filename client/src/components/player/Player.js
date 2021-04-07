import Cookies from "js-cookie";
import React, { useEffect, useState, useCallback } from "react";
import { loadPlayer, playSong, play, pause } from "./playerHelper";

const Player = () => {
  const [playbackState, setPlaybackState] = useState([]);
  const [deviceId, setDeviceId] = useState("none");
  // const handleDeviceId = useCallback((id) => {
  //   setDeviceId(id);
  // }, []);

  const deviceIdStateRef = React.useRef(deviceId);
  const handleDeviceId = (data) => {
    deviceIdStateRef.current = data;
    setDeviceId(data);
  };

  useEffect(() => {
    console.log("state deviceid changed: " + deviceId);
  }, [deviceId, playbackState]);
  useEffect(() => {
    loadPlayer().then(() => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = Cookies.get("access_token");
        const player = new window.Spotify.Player({
          name: "spotify98",
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        // Error handling
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

        // Playback status updates
        player.addListener("player_state_changed", (state) => {
          setPlaybackState(state);
          console.log(state);
        });

        // Ready
        player.addListener("ready", ({ device_id }, setDeviceId) => {
          console.log("Ready with Device ID", device_id);
          handleDeviceId(device_id);
        });

        // Not Ready
        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });
        console.log(player.connect());
      };
    });
  }, []);

  return (
    <div>
      player pls
      <button onClick={() => play(deviceId)}>play</button>
      <button onClick={() => pause(deviceId)}>pause</button>
    </div>
  );
};

export default Player;
