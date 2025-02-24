import axios from 'axios';

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID; // Ensure this is set in your environment variables
const modelId = 'eleven_flash_v2_5'; // Low-latency model

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { replyText } = req.body;
  if (!replyText) {
    res.status(400).json({ error: 'replyText is required' });
    return;
  }

  try {
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: replyText,
        model_id: modelId, // Specify the low-latency model
      },
      {
        headers: {
          'xi-api-key': ELEVEN_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Receive audio data as binary
      }
    );

    const audioBuffer = ttsResponse.data;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('TTS API error:', error);
    res.status(500).json({ error: 'Failed to get TTS response' });
  }
}

