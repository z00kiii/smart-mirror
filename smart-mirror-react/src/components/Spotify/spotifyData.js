const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = "1cbba7eba23147e197463f1f087e8705";
export const clientSecret = "228a33b592c9437d9a19a3765ed64652";
export const redirectUri = "http://localhost:3000";
export const mirrorId = "74adc5789ce92de7bbb5e3d84a287a1ce6d3e7f5";

const scopes =
  "streaming%20user-read-email%20user-read-private%20user-read-playback-state%20user-modify-playback-state%20user-library-modify%20user-library-read%20streaming%20user-read-playback-position%20playlist-modify-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-currently-playing%20user-read-recently-played";

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;

export const refreshDuration = 1000;
