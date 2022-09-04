import "./App.css";
import { useEffect, useState } from "react";
import Spotify from "./components/Spotify/Spotify";
import Controlbar from "./components/Controlbar/Controlbar";
import Date from "./components/Date/Date";
import Weather from "./components/Weather/Weather";
import useAuth from "./components/Spotify/useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import { clientId, loginUrl } from "./components/Spotify/spotifyData";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
});

function App() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    window.location = loginUrl;
  }

  const accessToken = useAuth(code);
  const [showSpotify, setShowSpotify] = useState(false);
  let interval = null;

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const startApp = () => {
    axios.get("http://localhost:3000", { timeout: 1000 }).then((res) => {
      if (res.status === 200) {
        if (interval) {
          clearInterval(interval);
        }
        setShowSpotify(true);
      }
    });
  };

  startApp();
  interval = setInterval(() => {
    console.log("asking");
    startApp();
  }, 5000);

  return (
    <div className="bg-black text-white h-screen border-2 border-gray-500 p-2 tracking-wide font-mono main">
      <div className="w-32 absolute bottom-0.5 left-1 m-2 mb-1.5 leading-tight">
        {showSpotify ? (
          <Spotify spotifyApi={spotifyApi} />
        ) : (
          <div>fuck off</div>
        )}
      </div>
      <div className="w-12 absolute bottom-5 right-1 m-2 leading-tight">
        <Controlbar spotifyApi={spotifyApi} />
      </div>
      <div className="w-40 absolute top-14 right-1 m-2 leading-tight">
        <Weather />
      </div>
      <div className="w-fit absolute top-1 right-1 m-2 leading-tight">
        <Date />
      </div>
    </div>
  );
}

export default App;
