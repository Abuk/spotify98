import _ from "lodash";
import AlbumArt from "./AlbumArt";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import {
  playbackStateSkeleton,
  loadPlayer,
  playSong,
  pause,
  fetchCurrentDevice,
  fetchCurrentPlayback,
  fetchLastTrack,
} from "./playerHelper";
import Time from "./Time";
import "98.css";

const Player = () => {
  const [playback, setPlayback] = useState(false);
  const [playbackState, setPlaybackState] = useState(playbackStateSkeleton);
  const [deviceId, setDeviceId] = useState("");
  const [currentDeviceId, setCurrentDeviceId] = useState("");
  const playbackRef = React.useRef(playback);
  const playbackStateRef = React.useRef(playbackState);
  const deviceIdStateRef = React.useRef(deviceId);
  const currentDeviceIdStateRef = React.useRef(currentDeviceId);
  let timeElapsed = React.useRef();

  const handlePlayback = (data) => {
    playbackRef.current = data;
    setPlayback(data);
  };
  const handlePlaybackState = (data) => {
    playbackStateRef.current = data;
    setPlaybackState(data);
  };
  const handleDeviceId = (data) => {
    deviceIdStateRef.current = data;
    setDeviceId(data);
  };
  const handleCurrentDeviceId = (data) => {
    currentDeviceIdStateRef.current = data;
    setCurrentDeviceId(data);
  };

  useEffect(() => {
    console.log("state deviceid changed: " + deviceId);
    var hasBeenSetActive = false;
    fetchCurrentDevice().then((res) => {
      res.devices.forEach((device) => {
        if (device.is_active) {
          handleCurrentDeviceId(device.id);
          hasBeenSetActive = true;
        }
      });
    });
    if (!hasBeenSetActive) {
      handleCurrentDeviceId(deviceId);
    }
    fetchLastTrack().then((res) => {
      // var context_uri;
      // if (res.context === null) context_uri = "";
      // else context_uri = res.context.uri;
      // console.log(res.progress_ms);
      handlePlaybackState(res);
      if (res.actions.is_playing) {
        handlePlayback(true);
      }
    });
  }, [deviceId]);

  useEffect(() => {
    console.log("state current deviceid changed: " + currentDeviceId);
  }, [currentDeviceId]);

  useEffect(() => {
    //console.log(playbackState);
  }, [playbackState]);

  useEffect(() => {
    clearInterval(timeElapsed.current);

    timeElapsed.current = setInterval(() => {
      fetchCurrentPlayback().then((res) => {
        handlePlaybackState(res);
      });
    }, 1000);

    return () => {
      clearInterval(timeElapsed.current);
    };
  }, [playback]);

  useEffect(() => {
    let isMounted = true;
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
          if (isMounted) {
            fetchCurrentDevice().then((res) => {
              res.devices.forEach((device) => {
                if (device.is_active) {
                  handleCurrentDeviceId(device.id);
                }
              });
            });
          }
          //console.log(state);
        });

        // Ready
        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          if (isMounted) {
            handleDeviceId(device_id);
          }
        });

        // Not Ready
        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });
        console.log(player.connect());
      };
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="window w-full">
      <div className="window-body">
        <div className="grid grid-cols-3">
          <div>
            <AlbumArt
              src={playbackState.item.album.images[0].url}
              alt={playbackState.item.album.name}
              trackName={playbackState.item.name}
              authors={_.compact(
                _.map(playbackState.item.artists, "name")
              ).join(", ")}
            ></AlbumArt>
          </div>
          <div className="min-w-96 flex flex-col items-stretch">
            <div className="my-auto self-center">
              {!playback ? (
                <button
                  onClick={() => {
                    console.log(playbackState.is_playing);
                    if (currentDeviceId !== deviceId) {
                      playSong(
                        currentDeviceId,
                        playbackState.context.uri,
                        playbackState.item.uri.uri,
                        playbackState.progress_ms
                      );
                    } else {
                      playSong(
                        deviceId,
                        playbackState.context,
                        playbackState.item.uri,
                        playbackState.progress_ms
                      );
                    }
                    if (!playback) setPlayback(true);
                  }}
                >
                  play
                </button>
              ) : (
                <button
                  onClick={() => {
                    pause(currentDeviceId);
                    setPlayback(false);
                  }}
                >
                  pause
                </button>
              )}
            </div>
            <div className="my-auto">
              <Time
                progress={playbackState.progress_ms}
                duration={playbackState.item.duration_ms}
              ></Time>
            </div>
          </div>
          <div>content bro</div>
        </div>
      </div>
    </div>
  );
};

export default Player;
