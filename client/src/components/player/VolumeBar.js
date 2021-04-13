import { useEffect, useState } from "react";
import { changeVolume } from "./playerHelper";

const VolumeBar = (props) => {
  const [volume, setVolume] = useState(props.currVolume);
  const [volumeWanted, setVolumeWanted] = useState(0);

  useEffect(() => {
    setVolume(props.currVolume);
  }, [props.currVolume]);

  const userClicked = (event) => {
    setVolumeWanted(event.currentTarget.value);
  };

  useEffect(() => {
    if (volumeWanted !== 0) {
      setVolume(volumeWanted);
      changeVolume(volumeWanted);
      setTimeout(1000);
    }
  }, [volumeWanted]);

  return (
    <div className="my-2 field-row flex w-40">
      <label htmlFor="volumebar">Volume</label>
      <input
        id="volumebar"
        type="range"
        min={0}
        max={100}
        value={volume}
        step="10"
        onInput={userClicked}
      />
    </div>
  );
};

export default VolumeBar;
