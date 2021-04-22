import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchPlaylists } from "../api/fetcher";

const LeftNav = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists().then((res) => {
      setPlaylists(res.items);
    });
  }, []);

  useEffect(() => {
    console.log("state playlists changed!");
    console.log(playlists);
  }, [playlists]);
  return playlists !== [] ? (
    <div>
      <ul className="tree-view w-36 h-auto">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          Playlists
          <ul>
            {playlists.map((list, i) => (
              <li key={i}>
                <Link to={`/playlist/${list.id}`}>{list.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default LeftNav;
