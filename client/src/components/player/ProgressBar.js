import { useEffect, useState } from "react";
import { seekTrack } from "./playerHelper";
//import "ProgressBar.css";

const calcToMin = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);

  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const ProgressBar = (props) => {
  const [timeElapsed, setTimeElapsed] = useState(props.progress);
  const [songLength, setSongLength] = useState(props.duration);
  const [timeWanted, setTimeWanted] = useState(0);

  useEffect(() => {
    setTimeElapsed(props.progress);
    setSongLength(props.duration);
  }, [props.progress, props.duration]);

  const userClicked = (event) => {
    setTimeWanted(event.currentTarget.value);
  };

  useEffect(() => {
    if (timeWanted !== 0) {
      setTimeElapsed(timeWanted);
      seekTrack(timeWanted);
      setTimeout(1000);
    }
  }, [timeWanted]);

  return (
    <div className="my-2 field-row flex w-auto">
      <label htmlFor="seekbar">{calcToMin(timeElapsed)}</label>
      <input
        id="seekbar"
        type="range"
        min={0}
        max={songLength}
        value={timeElapsed}
        step="10"
        onInput={userClicked}
      />
      <label htmlFor="seekbar">{calcToMin(songLength)}</label>
    </div>
  );
};

export default ProgressBar;
