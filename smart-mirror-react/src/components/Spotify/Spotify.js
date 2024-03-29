import { refreshDuration, mirrorId, playingPlaceholder } from "./spotifyData";
import { useEffect, useState } from "react";
import "./Spotify.css";

const Spotify = ({ spotifyApi }) => {
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const [prevSong, setPrevSong] = useState("");
  const [liked, setLiked] = useState(false);
  const [devices, setDevices] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showDevicePanel, setShowDevicePanel] = useState(false);
  const [showPlaylistPanel, setShowPlaylistPanel] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  let dewIt = false;
  let inTheLoop = false;
  const initRefreshInterval = () => {
    if (dewIt) {
      console.log("setInterval");
      setRefreshInterval(
        setInterval(() => {
          getCurrentPlayback();
        }, refreshDuration)
      );
    }
  };

  const clearRefreshInterval = (refreshInterval) => {
    if (!dewIt) {
      console.log("clearInterval");
      clearInterval(refreshInterval);
      dewIt = true;
    }
  };

  const getCurrentPlayback = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (data.body != null && data.body.currently_playing_type === "track") {
          //console.log("i got: " + data.body);
          setCurrentPlayback(data.body);
        } else {
          setCurrentPlayback(playingPlaceholder);
        }
      })
      .catch((err) => console.log(err));
  };

  const transferAndPlayOnMirror = () => {
    spotifyApi
      .transferMyPlayback([mirrorId])
      .then(() => {
        console.log("playplay");
        spotifyApi.play();
      })
      .catch((err) => {
        console.log("Raspotify is a bitch " + err.message);
      });
  };

  const autoplayer = () => {
    if (localStorage.getItem("isPlaying") !== "true") {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        if (data.body && data.body.is_playing) {
          localStorage.setItem("isPlaying", true);
          dewIt = true;
          initRefreshInterval();
        } else {
          inTheLoop = true;
          spotifyApi.setVolume(50);
          transferAndPlayOnMirror();
        }
      });
    }
  };

  useEffect(() => {
    if (currentPlayback === null) {
      localStorage.setItem("isPlaying", false);
      for (var duration = 3000; duration <= 15000; duration += 3000) {
        setTimeout(autoplayer, duration);
      }
    }
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const togglePlayback = () => {
    currentPlayback.is_playing
      ? spotifyApi.pause()
      : spotifyApi.play().catch((err) => {
          transferAndPlayOnMirror();
        });
  };

  const skipToPrevious = () => {
    spotifyApi.skipToPrevious();
  };

  const skipToNext = () => {
    spotifyApi.skipToNext();
  };

  let volumeInputTimeout = null;
  const volumeInput = (input) => {
    if (volumeInputTimeout) {
      clearTimeout(volumeInputTimeout);
    }
    volumeInputTimeout = setTimeout(() => {
      spotifyApi.setVolume(input).then(() => {
        initRefreshInterval();
      });
    }, 1000);
  };

  let seekTimeout = null;
  const seek = (input) => {
    if (seekTimeout) {
      clearTimeout(seekTimeout);
    }
    seekTimeout = setTimeout(() => {
      spotifyApi.seek(input).then(() => {
        initRefreshInterval();
      });
    }, 1000);
  };

  const getDevices = () => {
    return new Promise((resolve, reject) => {
      spotifyApi.getMyDevices().then((res) => {
        setDevices(res.body.devices);
        setShowDevicePanel(true);
        return resolve;
      });
    });
  };

  const getPlaylists = () => {
    return new Promise((resolve, reject) => {
      spotifyApi
        .getUserPlaylists("z0ki", { limit: 50 })
        .then((res) => {
          setPlaylists(res.body.items);
          setShowPlaylistPanel(true);
        })
        .then(() => {
          if (currentPlayback.context) {
            spotifyApi
              .getPlaylist(currentPlayback.context.uri.split(":").pop())
              .then((res) => {
                setCurrentPlaylist(res.body);
                return resolve;
              });
          }
        });
    });
  };

  const containsMySavedTracks = (id) => {
    spotifyApi.containsMySavedTracks([id]).then((res) => {
      setLiked(res.body[0]);
    });
  };

  const toggleLiked = (id) => {
    liked
      ? spotifyApi.removeFromMySavedTracks([id])
      : spotifyApi.addToMySavedTracks([id]);
    setLiked(!liked);
  };

  const toggleDevicePanel = async () => {
    if (!showDevicePanel) {
      await getDevices();
    } else {
      setShowDevicePanel(false);
    }
  };

  const togglePlaylistPanel = async () => {
    if (!showPlaylistPanel) {
      await getPlaylists();
    } else {
      setShowPlaylistPanel(false);
    }
  };

  const millisToMinutesAndSeconds = (millis) => {
    let minutes = Math.floor(millis / 60000);
    let seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return seconds === 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  //does it on every render --performance
  const isOverflown = (element) => {
    if (!element) return false;
    let overflown = element.scrollWidth > element.parentElement.clientWidth;
    if (overflown) {
      document
        .querySelector(":root")
        .style.setProperty(
          "--titleparentwidth",
          element.parentElement.clientWidth + "px"
        );
    }
    return overflown;
  };

  if (currentPlayback) {
    if (prevSong !== currentPlayback.item.name) {
      containsMySavedTracks(currentPlayback.item.id);
      setPrevSong(currentPlayback.item.name);
    }
    let currentPlaybackProgress = millisToMinutesAndSeconds(
      currentPlayback.progress_ms
    );
    let currentPlaybackLeft = millisToMinutesAndSeconds(
      currentPlayback.item.duration_ms - currentPlayback.progress_ms
    );

    const titleOverflown = isOverflown(document.getElementById("title"));
    const artistsOverflown = isOverflown(document.getElementById("artists"));

    return (
      <div>
        <img
          className="w-full"
          onClick={togglePlaylistPanel}
          src={currentPlayback.item.album.images[1].url}
        />
        <div className="flex justify-between mt-2.5 relative">
          <div className="truncate title-wrapper fade w-max">
            <div
              id="title"
              className={`text-lg font-bold w-fit px-1 ${
                titleOverflown ? "scroll" : ""
              }`}
            >
              {currentPlayback.item.name}
            </div>
            <div
              id="artists"
              className={`text-sm mt-0.5 w-fit px-1 ${
                artistsOverflown ? "scroll" : ""
              }`}
            >
              {currentPlayback.item.artists
                .map((artist) => {
                  return artist.name;
                })
                .join(", ")}
            </div>
          </div>
          <div
            className="ml-1.5 align-middle"
            onClick={() => {
              toggleLiked(currentPlayback.item.id);
            }}
          >
            {liked ? (
              <i className="fa-solid fa-heart fa-xs"></i>
            ) : (
              <i className="fa-regular fa-heart fa-xs"></i>
            )}
          </div>
        </div>
        <div key={currentPlayback.progress_ms}>
          <input
            type="range"
            className="w-full appearance-none bg-transparent"
            min="0"
            max={currentPlayback.item.duration_ms}
            step="1000"
            defaultValue={currentPlayback.progress_ms}
            // onMouseUp={(e) => {
            //   console.log("mouseup");
            //   seek(e.target.value);
            // }}
            onChange={(e) => {
              clearRefreshInterval(refreshInterval);
              seek(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-between text-xxs">
          <div>{currentPlaybackProgress}</div>
          <div>-{currentPlaybackLeft}</div>
        </div>
        <div className="flex justify-center mt-2.5 text-3xl">
          <i
            className="fa-solid fa-backward fa-lg"
            onClick={skipToPrevious}
          ></i>
          <div className="w-10 flex justify-center" onClick={togglePlayback}>
            {currentPlayback.is_playing ? (
              <i className="fa-solid fa-pause fa-lg"></i>
            ) : (
              <i className="fa-solid fa-play fa-lg"></i>
            )}
          </div>
          <i className="fa-solid fa-forward fa-lg" onClick={skipToNext}></i>
        </div>
        <div
          className="flex align-middle justify-between mt-4"
          key={currentPlayback.device.volume_percent}
        >
          <div className="fa-solid fa-volume-down text-lg"></div>
          <input
            type="range"
            className="appearance-none bg-transparent w-24"
            min="0"
            max="100"
            step="5"
            defaultValue={currentPlayback.device.volume_percent}
            // onMouseUp={(e) => {
            //   console.log("mouseup");
            //   volumeInput(e.target.value);
            // }}
            onChange={(e) => {
              clearRefreshInterval(refreshInterval);
              volumeInput(e.target.value);
            }}
          />
          <div className="fa-solid fa-volume-down text-lg "></div>
        </div>
        <div className="flex justify-between mt-1.5">
          <div className="text-sm self-center">
            {currentPlayback.device.name}
          </div>
          <div>
            <i
              className="fa-brands fa-deezer fa-sm"
              onClick={toggleDevicePanel}
            ></i>
          </div>
        </div>
        {showPlaylistPanel ? (
          <ul className="absolute left-36 top-0 px-6 py-1 min-w-177px w-max max-h-60 border-2 border-gray-800 rounded-md opacity-95 overflow-auto">
            {currentPlaylist ? (
              <li className="text-center text-gray-300 text-lg leading-6 border-b-2 ">
                {currentPlaylist.name}
              </li>
            ) : (
              <></>
            )}
            {playlists.map((playlist) => {
              return (
                <li
                  className="text-center text-xl leading-6 cursor-pointer"
                  key={playlist.id}
                  onClick={() => {
                    spotifyApi.play({ context_uri: playlist.uri }).then(() => {
                      spotifyApi.setShuffle(true);
                      setShowPlaylistPanel(false);
                    });
                  }}
                >
                  {playlist.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <></>
        )}
        {showDevicePanel ? (
          <ul className="absolute bottom-3 right-0 bg-black p-1 border-2 border-gray-800 rounded-md opacity-95">
            {devices.map((device) => {
              return (
                <li
                  className="text-right text-md leading-6"
                  key={device.id}
                  onClick={() => {
                    spotifyApi.transferMyPlayback([device.id]).then(() => {
                      setShowDevicePanel(false);
                    });
                  }}
                >
                  {device.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {inTheLoop ? <div>still working</div> : <div>im playing dumbass</div>}
        nobody in da house
        <div onClick={transferAndPlayOnMirror}>play Anyways</div>
      </div>
    );
  }
};
export default Spotify;
