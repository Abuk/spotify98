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
import VolumeBar from "./VolumeBar";
import DeviceSelector from "./DeviceSelector";
import "98.css";

const Player = () => {
  const [playback, setPlayback] = useState(false);
  const [playbackState, setPlaybackState] = useState(playbackStateSkeleton);
  const [device, setDevice] = useState(undefined);
  const [currentDevice, setCurrentDevice] = useState(undefined);
  const playbackRef = React.useRef(playback);
  const playbackStateRef = React.useRef(playbackState);
  const deviceStateRef = React.useRef(device);
  const currentDeviceStateRef = React.useRef(currentDevice);
  let timeElapsed = React.useRef();

  const handlePlayback = (data) => {
    playbackRef.current = data;
    setPlayback(data);
  };
  const handlePlaybackState = (data) => {
    playbackStateRef.current = data;
    setPlaybackState(data);
  };
  const handleDevice = (data) => {
    deviceStateRef.current = data;
    setDevice(data);
  };
  const handleCurrentDevice = (data) => {
    currentDeviceStateRef.current = data;
    setCurrentDevice(data);
  };

  useEffect(() => {
    if (typeof device !== "undefined") {
      console.log("state deviceid changed: " + device);
      var hasBeenSetActive = false;
      fetchCurrentDevice().then((res) => {
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
      fetchLastTrack().then((res) => {
        handlePlaybackState(res);
        if (res.actions.is_playing) {
          handlePlayback(true);
        }
      });
    }
  }, [device]);

  useEffect(() => {
    console.log("state current deviceid changed: " + currentDevice);
  }, [currentDevice]);

  useEffect(() => {
    setPlayback(playbackState.is_playing);
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
          console.log(state);
          if (isMounted) {
            fetchCurrentDevice().then((res) => {
              res.devices.forEach((device) => {
                if (device.is_active) {
                  handleCurrentDevice(device);
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
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="window w-full">
      <div className="window-body">
        <div className="grid grid-cols-3">
          <div className="my-auto">
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
                    playSong(
                      typeof currentDevice === "undefined"
                        ? device.id
                        : currentDevice.id,
                      playbackState.context,
                      playbackState.item.uri,
                      playbackState.progress_ms
                    );

                    if (!playback) setPlayback(true);
                  }}
                >
                  play
                </button>
              ) : (
                <button
                  onClick={() => {
                    pause(currentDevice.id);
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
          <div className="flex w-auto items-center justify-end mr-2">
            <div className="mr-2">playlist</div>
            <div className="mr-2">
              <DeviceSelector currDevice={currentDevice}></DeviceSelector>
            </div>
            <div className="mr-2">
              <VolumeBar
                currVolume={
                  typeof currentDevice === "undefined"
                    ? 0
                    : currentDevice.volume_percent
                }
              ></VolumeBar>
            </div>
            <div className="mr-2">expand</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
