import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";

function loadPlayer() {
  return new Promise((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player");

    if (!scriptTag) {
      const script = document.createElement("script");

      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => resolve();
      script.onerror = (error) =>
        reject(new Error(`loadScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}

function play(deviceId) {
  const spotify_uri = "spotify:track:6Z5Val5Ne3V4SV7i735XAZ";
  axios
    .put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      JSON.stringify({ uris: [spotify_uri] }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    )
    .catch((error) => {
      console.log(error);
      return false;
    });
  return true;
}

const Player = () => {
  const [playbackState, setPlaybackState] = useState([]);
  const [deviceId, setDeviceId] = useState("voidpico");
  const [testState, setTestState] = useState(0);
  const handleDeviceId = useCallback((id) => {
    setDeviceId(id);
  }, []);

  useEffect(() => {
    console.log(deviceId);
    console.log(testState);
  }, [deviceId, testState]);

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
      //   console.log(testState);

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
        //console.log(deviceId);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
      console.log(player.connect());
    };
  });

  return (
    <div>
      player pls
      <button onClick={() => play(deviceId)}>play</button>
    </div>
  );
};

export default Player;
