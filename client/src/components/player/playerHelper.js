import Cookies from "js-cookie";
import axios from "axios";

export const loadPlayer = () => {
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
};

export const playSong = ({
  deviceId: deviceId,
  contextId: contextId,
  mediaId: mediaId,
  volume: volume,
  timeOffset: timeOffset,
}) => {
  if (typeof mediaId === String) {
    mediaId = [mediaId];
  }
  const data = {
    context_uri: contextId,
    uris: mediaId,
    volume: volume,
    position_ms: timeOffset,
  };
  axios
    .put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      JSON.stringify(data),
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
};

export const play = (deviceId) => {
  axios
    .put(
      `https://api.spotify.com/v1/me/player/play`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    )
    .then((res) => {
      console.log(res.body);
      console.log(res.status);
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return true;
};

export const pause = (deviceId) => {
  axios
    .put(
      `https://api.spotify.com/v1/me/player/pause`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    )
    .then((res) => {
      console.log(res.body);
      console.log(res.status);
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};
