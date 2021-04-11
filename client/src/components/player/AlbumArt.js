import "98.css";

const AlbumArt = (props) => {
  // console.log(props);
  return (
    <div className="flex">
      <div className="window w-16 mb-2 mr-2">
        <div className="w-auto">
          <img src={props.src} alt={props.title}></img>
        </div>
      </div>
      <div>
        <h4>{props.trackName}</h4>
        <h4 className="text-xl">{props.authors}</h4>
      </div>
    </div>
  );
};

export default AlbumArt;
