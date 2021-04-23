import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylist } from "../api/fetcher";
import { playSong } from "../player/playerHelper";

const Playlist = (props) => {
  let { id } = useParams();
  const [playlistInfo, setPlaylistInfo] = useState(undefined);
  const [playlistItems, setPlaylistItems] = useState([]);

  useEffect(() => {
    getPlaylist(id).then((res) => {
      setPlaylistItems(res.tracks.items);
      setPlaylistInfo(res);
    });
  }, [id]);
  return (
    <div>
      {id}
      {typeof playlistInfo !== "undefined" ? (
        <div className="window-body flex max-h-96 w-80 overflow-scroll ">
          <div>{playlistInfo.name}</div>
          <div>
            <ul>
              {playlistItems.map((item, i) => (
                <li key={i}>
                  <a
                    onDoubleClick={() =>
                      playSong(props.current_device, null, item.track.uri, 0)
                    }
                  >
                    {item.track.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default Playlist;
