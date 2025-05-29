interface SpotifyCredentials {
  access_token: string;
  expires_in: number;
}

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

let accessToken = '';
let tokenExpirationTime = 0;

const getAccessToken = async (): Promise<string> => {
  if (Date.now() < tokenExpirationTime - 1000) {
    return accessToken;
  }

  const clientId = '52e6eba986d346e9b9f034ff6c59cf2b';
  const clientSecret = '83b2f4d5cd52475e9d4b5ffd95035231';
  const credentials = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as SpotifyCredentials;
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const getRandomTrack = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const token = await getAccessToken();
      // Using the custom "songs which make an excellent spaghetti timer" playlist
      const response = await fetch('https://api.spotify.com/v1/playlists/37lRcA7HqlhM4ASWwudIRN/tracks?limit=50&fields=items(track(name,artists,album,external_urls))&market=US', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`Spotify API error: ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from Spotify API');
      }

      // Filter out any null tracks and get valid tracks
      const validTracks = data.items
        .filter((item: any) => item.track !== null && item.track.name && item.track.artists && item.track.album?.images?.[0]?.url)
        .map((item: any) => item.track as SpotifyTrack);

      if (validTracks.length === 0) {
        console.error('No valid tracks found in playlist');
        throw new Error('No valid tracks found in playlist');
      }

      // Get a random track from the valid tracks
      const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)];
      
      return {
        name: randomTrack.name,
        artist: randomTrack.artists[0].name,
        image: randomTrack.album.images[0].url,
        url: randomTrack.external_urls.spotify
      };
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        console.error('All retry attempts failed');
        // Return a default track object if all retries fail
        return {
          name: 'Unable to load track',
          artist: 'Please try again',
          image: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
          url: 'https://open.spotify.com'
        };
      }
      
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // This should never be reached due to the return in the catch block
  return {
    name: 'Unable to load track',
    artist: 'Please try again',
    image: 'https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e',
    url: 'https://open.spotify.com'
  };
}; 