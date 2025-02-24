import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!GEMINI_API_KEY || !ELEVEN_API_KEY || !voiceId) {
    return res.status(500).json({ error: 'Missing required environment variables.' });
  }

  const { userText } = req.body;
  if (!userText) {
    return res.status(400).json({ error: 'userText is required.' });
  }

  let aiText;
  try {
    // --- Gemini API Call ---
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: userText
          }]
        }],
        generationConfig: {
          temperature: 0.7
        }
      }
    );

    aiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      return res.status(500).json({ error: 'Gemini API did not return a valid response.' });
    }
  } catch (err) {
    console.error('Error during Gemini API call:', err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Error during AI text generation.' });
  }

  // --- Evaluate Diagnosis for Emergency ---
  const emergencyKeywords = ['emergency', 'urgent', 'immediately', 'hospital', '911', 'critical'];
  const needsEmergency = emergencyKeywords.some(keyword => aiText.toLowerCase().includes(keyword));
  const evaluation = needsEmergency
    ? 'Warning: The diagnosis indicates a potential emergency. Please seek immediate medical attention.'
    : 'The diagnosis appears stable, but this is not a substitute for professional medical advice.';
  
  const finalResponse = `${aiText}\n\n${evaluation}`;

  let ttsBuffer;
  try {
    // --- ElevenLabs TTS API Call ---
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: finalResponse,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'xi-api-key': ELEVEN_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    ttsBuffer = ttsResponse.data;
  } catch (err) {
    console.error('Error during ElevenLabs TTS API call:', err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Error during text-to-speech conversion.' });
  }

  // Return the audio as an MPEG file
  res.setHeader('Content-Type', 'audio/mpeg');
  return res.status(200).send(ttsBuffer);
}
