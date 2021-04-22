import _ from "lodash";
import AlbumArt from "./AlbumArt";
import React, { useEffect, useState } from "react";
import { playSong, pause, fetchLastTrack } from "./playerHelper";
import Time from "./Time";
import VolumeBar from "./VolumeBar";
import DeviceSelector from "./DeviceSelector";
import "98.css";

const Player = (props) => {
  // prop states
  const [playbackState, setPlaybackState] = useState(props.playback_state);
  const [currentDevice, setCurrentDevice] = useState(props.current_device);
  // states
  const [device, setDevice] = useState(props.this_device);
  const [playback, setPlayback] = useState(props.playback_state.is_playing);

  const playbackRef = React.useRef(playback);
  const playbackStateRef = React.useRef(playbackState);
  const currentDeviceStateRef = React.useRef(currentDevice);

  const handlePlayback = (data) => {
    playbackRef.current = data;
    setPlayback(data);
  };
  const handlePlaybackState = (data) => {
    playbackStateRef.current = data;
    setPlaybackState(data);
  };
  const handleCurrentDevice = (data) => {
    currentDeviceStateRef.current = data;
    setCurrentDevice(data);
  };

  useEffect(() => {
    console.log("state deviceid changed: " + device);
    fetchLastTrack().then((res) => {
      handlePlaybackState(res);
      if (res.actions.is_playing) {
        handlePlayback(true);
      }
    });
  }, [device]);

  useEffect(() => {
    setPlaybackState(props.playback_state);
    setPlayback(props.playback_state.is_playing);
    setCurrentDevice(props.current_device);
    setDevice(props.this_device);
  }, [props]);

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
            <div className="self-center">
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
