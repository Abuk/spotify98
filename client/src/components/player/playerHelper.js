import Cookies from "js-cookie";
import axios from "axios";
import { refreshAccessToken } from "../login/loginHelper";

export const playbackStateSkeleton = {
  timestamp: 0,
  context: {
    external_urls: {
      spotify: "",
    },
    href: "",
    type: "album",
    uri: "",
  },
  progress_ms: 0,
  item: {
    album: {
      album_type: "",
      artists: [
        {
          external_urls: {
            spotify: "",
          },
          href: "",
          id: "",
          name: "",
          type: "",
          uri: "",
        },
      ],
      external_urls: {
        spotify: "",
      },
      href: "",
      id: "",
      images: [
        {
          height: 0,
          url: "",
          width: 0,
        },
        {
          height: 0,
          url: "",
          width: 0,
        },
        {
          height: 0,
          url: "",
          width: 0,
        },
      ],
      name: "",
      release_date: "",
      release_date_precision: "",
      total_tracks: 1,
      type: "",
      uri: "",
    },
    artists: [
      {
        external_urls: {
          spotify: "",
        },
        href: "",
        id: "",
        name: "",
        type: "",
        uri: "",
      },
    ],
    disc_number: 1,
    duration_ms: 0,
    explicit: false,
    external_ids: {
      isrc: "",
    },
    external_urls: {
      spotify: "",
    },
    href: "",
    id: "",
    is_local: false,
    is_playable: true,
    name: "",
    popularity: 44,
    preview_url: "",
    track_number: 1,
    type: "",
    uri: "",
  },
  currently_playing_type: "track",
  actions: {
    disallows: {
      resuming: true,
      skipping_prev: true,
    },
  },
  is_playing: true,
};

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

export const playSong = (deviceId, contextId, mediaId, timeOffset) => {
  if (typeof mediaId === "string") {
    mediaId = [mediaId];
  }
  let data;
  if (contextId !== null) {
    data = {
      context_uri: contextId,
      position_ms: timeOffset,
    };
  } else {
    data = {
      uris: mediaId,
      position_ms: timeOffset,
    };
  }
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

export const play = (curId, myId) => {
  var did;
  if (curId !== "") did = `?device_id=${curId}`;
  else did = `?device_id=${myId}`;
  axios
    .put(
      `https://api.spotify.com/v1/me/player/play${did}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    )
    .then((res) => {})
    .catch((error) => {
      console.log(error);
      return false;
    });
  return true;
};

export const pause = () => {
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
      // console.log(res.body);
      // console.log(res.status);
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const fetchCurrentDevice = async () => {
  let promise = axios.get(`https://api.spotify.com/v1/me/player/devices`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
  });

  return promise.then((res) => {
    return res.data;
  });
  // .catch((error) => {
  //   console.log(error);
  //   return false;
  // });
};

export const fetchCurrentPlayback = async () => {
  let promise = axios.get(
    `https://api.spotify.com/v1/me/player/currently-playing?market=CZ`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    }
  );

  return promise
    .then((res) => {
      if (res.status === 200) {
        if (res.data.item === null) {
          return fetchRecentlyPlayed().then((res) => {
            return res;
          });
        } else {
          return res.data;
        }
      } else if (res.status === 401) refreshAccessToken();
      else if (res.status === 204) {
        return fetchRecentlyPlayed().then((res) => {
          return res;
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const fetchLastTrack = async () => {
  let promise = axios.get(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
  });

  return promise
    .then((res) => {
      if (res.status === 200) {
        if (res.data.item === null) {
          return fetchRecentlyPlayed().then((res) => {
            return res;
          });
        } else {
          return res.data;
        }
      } else if (res.status === 401) refreshAccessToken();
      else if (res.status === 204) {
        return fetchRecentlyPlayed().then((res) => {
          return res;
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const fetchRecentlyPlayed = async () => {
  let promise = axios.get(
    `https://api.spotify.com/v1/me/player/recently-played?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    }
  );

  return promise.then((res) => {
    if (res.status === 200) {
      //create a fake currently playing object from last known track
      let stuff = {
        item: res.data.items[0].track,
        actions: {
          is_playing: false,
        },
        progress_ms: 0,
      };
      return stuff;
    }
  });
};
