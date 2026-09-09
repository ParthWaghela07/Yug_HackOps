import config from '../config.js';

// Mood-to-Spotify search query mapping for 8 common moods
const MOOD_QUERY_MAP = {
  sad: 'genre:indie acoustic melancholic sad',
  happy: 'genre:pop happy feel good uplifting',
  energetic: 'genre:workout energetic high energy EDM',
  calm: 'genre:ambient calm peaceful lo-fi chill',
  focused: 'genre:study deep focus lo-fi beats classical',
  anxious: 'genre:ambient peaceful soothing relaxation',
  angry: 'genre:rock heavy metal intense workout',
  romantic: 'genre:r-n-b acoustic love romantic soul',
};

// Curated fallbacks in case Spotify API credentials are not set yet or rate-limited
const FALLBACK_TRACKS = {
  focused: [
    { id: 'fb-1', name: 'Lofi Study Beats', artist: 'Lofi Girl', album: 'Chillhop Essentials', albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com/genre/0JQ5DAqbMKFCfObSZ2Qw3G' },
    { id: 'fb-2', name: 'Deep Focus Synth', artist: 'Kiasmos', album: 'Blurred', albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' },
    { id: 'fb-3', name: 'Ambient Rain & Piano', artist: 'Brian Eno', album: 'Reflection', albumArt: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' },
  ],
  default: [
    { id: 'fb-4', name: 'Acoustic Sunrise', artist: 'Bon Iver', album: 'For Emma', albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' },
    { id: 'fb-5', name: 'Calm Mind Meditation', artist: 'Marconi Union', album: 'Weightless', albumArt: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' },
  ],
};

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get Spotify Client Credentials Access Token server-side
 */
async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || config.spotify?.clientId;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || config.spotify?.clientSecret;

  if (!clientId || !clientSecret || clientId === 'your_spotify_client_id_here') {
    return null;
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      console.warn('[spotifyService] Failed to obtain Spotify access token:', res.statusText);
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return cachedToken;
  } catch (err) {
    console.warn('[spotifyService] Network error requesting Spotify token:', err.message);
    return null;
  }
}

/**
 * Search Spotify tracks by mood using GET /v1/search (type=track)
 */
export async function getTracksByMood(mood = 'focused') {
  const normalizedMood = mood.toLowerCase().trim();
  const query = MOOD_QUERY_MAP[normalizedMood] || `mood ${normalizedMood}`;

  const token = await getAccessToken();

  if (!token) {
    console.log(`[spotifyService] Client Credentials not configured. Using curated fallback for mood "${normalizedMood}".`);
    const tracks = FALLBACK_TRACKS[normalizedMood] || FALLBACK_TRACKS.default;
    return {
      mood: normalizedMood,
      queryUsed: query,
      isFallback: true,
      fallbackMessage: 'Spotify credentials not set in backend/.env — displaying curated demo tracks.',
      tracks,
    };
  }

  try {
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;
    const res = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn(`[spotifyService] Spotify search API returned ${res.status}`);
      const tracks = FALLBACK_TRACKS[normalizedMood] || FALLBACK_TRACKS.default;
      return { mood: normalizedMood, isFallback: true, tracks };
    }

    const data = await res.json();
    const rawItems = data.tracks?.items || [];

    const tracks = rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map((a) => a.name).join(', '),
      album: item.album?.name || '',
      albumArt: item.album?.images?.[0]?.url || item.album?.images?.[1]?.url || '',
      previewUrl: item.preview_url || null,
      spotifyUrl: item.external_urls?.spotify || `https://open.spotify.com/track/${item.id}`,
    }));

    return {
      mood: normalizedMood,
      queryUsed: query,
      isFallback: false,
      tracks,
    };
  } catch (err) {
    console.error('[spotifyService] Error searching Spotify:', err.message);
    const tracks = FALLBACK_TRACKS[normalizedMood] || FALLBACK_TRACKS.default;
    return { mood: normalizedMood, isFallback: true, tracks };
  }
}

export default { getTracksByMood };
