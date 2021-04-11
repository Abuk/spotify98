import ProgressBar from "./ProgressBar";

const Time = (props) => {
  return (
    <div>
      <ProgressBar
        progress={props.progress}
        duration={props.duration}
      ></ProgressBar>
    </div>
  );
};

export default Time;
