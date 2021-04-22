import axios from "axios";
import Cookies from "js-cookie";

export const fetchPlaylists = async () => {
  let promise = axios.get("https://api.spotify.com/v1/me/playlists", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
  });

  return promise.then((res) => {
    return res.data;
  });
};

export const getPlaylist = (id) => {
  let promise = axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
  });

  return promise.then((res) => {
    return res.data;
  });
};
