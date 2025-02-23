import axios from 'axios';

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID; // Ensure this is set in .env.local

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Get the text to convert from the request body
  const { replyText } = req.body;
  if (!replyText) {
    res.status(400).json({ error: 'replyText is required' });
    return;
  }

  try {
    // Call ElevenLabs API for text-to-speech
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text: replyText },
      {
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer" // Get the audio data as binary
      }
    );
    const audioBuffer = ttsResponse.data;

    // Return the audio data to the client
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(audioBuffer);
  } catch (error) {
    console.error("TTS API error:", error);
    res.status(500).json({ error: "Failed to get TTS response" });
  }
}
