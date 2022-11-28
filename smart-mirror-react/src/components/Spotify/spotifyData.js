require('dotenv').config();

export const clientId = process.env.CLIENT_ID;
export const clientSecret = process.env.CLIENT_SECRET;
export const mirrorId = process.env.MIRROR_ID;
const authEndpoint = "https://accounts.spotify.com/authorize";
export const redirectUri = "http://localhost:3000";

const scopes =
  "streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-library-modify%20user-library-read%20streaming%20user-read-playback-position%20playlist-modify-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-currently-playing%20user-read-recently-played";

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;

export const refreshDuration = 1000;

export const playingPlaceholder = {
  item: {
    name: "Wat te fak",
    artists: [{ name: "Imagine Dragons theze nuts" }],
    album: {
      images: [
        ,
        { url: "https://c.tenor.com/cNnsPB7dYfYAAAAC/dancing-dog.gif" },
      ],
    },
  },
  device: {
    volume_percent: 100,
  },
}
