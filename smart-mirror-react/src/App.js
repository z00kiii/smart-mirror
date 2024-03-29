import "./App.css";
import { useEffect } from "react";
import Spotify from "./components/Spotify/Spotify";
import Controlbar from "./components/Controlbar/Controlbar";
import Date from "./components/Date/Date";
import Weather from "./components/Weather/Weather";
import useAuth from "./components/Spotify/useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import { clientId, loginUrl } from "./components/Spotify/spotifyData";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
});

function App() {
  document.addEventListener("click", (event) => {
    const ripple = document.createElement("div");

    ripple.className = "ripple text-gray-500";
    document.body.appendChild(ripple);

    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;

    ripple.style.animation = "ripple-effect .2s  linear";
    ripple.onanimationend = () => document.body.removeChild(ripple);
  });

  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    window.location = loginUrl;
  }

  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  return (
    <div className="bg-black text-white h-screen border-2 border-gray-500 p-2 tracking-wide font-mono main">
      <div className="w-32 absolute bottom-0.5 left-1 m-2 mb-1.5 leading-tight">
        <Spotify spotifyApi={spotifyApi} />
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
