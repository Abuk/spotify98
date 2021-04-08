const calcToMin = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);

  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const Time = (props) => {
  const time = calcToMin(props.progress) + "/" + calcToMin(props.duration);
  return time;
};

export default Time;
