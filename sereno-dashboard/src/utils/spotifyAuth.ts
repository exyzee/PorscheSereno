import SpotifyWebApi from 'spotify-web-api-node';

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
  try {
    const token = await getAccessToken();
    const playlistId = '2dvgRSyecZ2qTSnUzVpSjR';
    const playlistUrl = 'https://open.spotify.com/playlist/2dvgRSyecZ2qTSnUzVpSjR?si=93208cab553a405a';

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items) {
      console.error('No tracks found in response:', data);
      return getFallbackTrack();
    }

    const tracks = data.tracks.items.filter((item: { track: SpotifyTrack }) => 
      item.track && 
      item.track.name && 
      item.track.artists && 
      item.track.artists.length > 0 && 
      item.track.album && 
      item.track.album.images && 
      item.track.album.images.length > 0
    );
    
    if (tracks.length === 0) {
      return getFallbackTrack();
    }

    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)].track;
    
    if (!randomTrack || !randomTrack.name || !randomTrack.artists[0] || !randomTrack.album.images[0] || !randomTrack.external_urls.spotify) {
      return getFallbackTrack();
    }
    
    return {
      name: randomTrack.name,
      artist: randomTrack.artists[0].name,
      albumArt: randomTrack.album.images[0].url,
      spotifyUrl: randomTrack.external_urls.spotify,
      playlistUrl
    };
  } catch (error) {
    console.error('Error fetching track:', error);
    return getFallbackTrack();
  }
};

const getFallbackTrack = () => ({
  name: 'Times Like These',
  artist: 'Foo Fighters',
  albumArt: 'https://i.scdn.co/image/ab67616d0000b273e0f81a716c2ce7fbf0cd3c85',
  spotifyUrl: 'https://open.spotify.com/track/1KxwZYyzWNyZSRyErj2ojT',
  playlistUrl: 'https://open.spotify.com/playlist/2dvgRSyecZ2qTSnUzVpSjR?si=93208cab553a405a'
}); 