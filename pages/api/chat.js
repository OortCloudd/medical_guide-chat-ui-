import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';

const detectLanguage = (text) => {
 const frenchPattern = /[àâèéêëîïôûùüÿçÀÂÈÉÊËÎÏÔÛÙÜŸÇ]/;
 return frenchPattern.test(text) ? 'fr' : 'en';
};

const getLocalizedMessages = (language) => {
 if (language === 'fr') {
   return {
     emergency: 'URGENCE : Cette situation nécessite une attention médicale immédiate.',
     urgent: 'URGENT : Consultez un professionnel de santé dans les 24 heures.',
     routine: 'Consultez un professionnel de santé dès que possible.'
   };
 }
 return {
   emergency: 'EMERGENCY: This situation requires immediate medical attention.',
   urgent: 'URGENT: Please seek medical care within the next 24 hours.',
   routine: 'Please seek medical care when possible.'
 };
};

const createContextualizedPrompt = (userText, conversationHistory) => {
 const formattedHistory = conversationHistory.map(msg => 
   `${msg.role === 'user' ? 'Patient' : 'Medical Guide'}: ${msg.content}`
 ).join('\n\n');

 return `You are a Medical Guide assisting patients in remote areas. Maintain conversation context and adapt your language to match the patient's language (French or English).

Complete Conversation History:
${formattedHistory}

Current patient message: ${userText}

Instructions:
1. Use the same language as the patient (French or English)
2. If information is missing, ask specific follow-up questions about:
  - Duration and severity of symptoms
  - Age and general health
  - Existing conditions
  - Current medications
  - Previous similar episodes
3. If you have sufficient information, provide:
  - Preliminary assessment
  - Potential causes
  - Care recommendations
  - Clear urgency guidance

Remember:
- Reference previous information
- Don't repeat questions already answered
- Provide clear, simple instructions
- Consider limited medical access
- Keep conversation natural and empathetic

Respond appropriately based on the complete conversation history.`;
};

export default async function handler(req, res) {
 if (req.method !== 'POST') {
   return res.status(405).json({ error: 'Method not allowed' });
 }

 if (!GEMINI_API_KEY || !ELEVEN_API_KEY || !voiceId) {
   return res.status(500).json({ error: 'Missing required environment variables.' });
 }

 const { userText, conversationHistory = [] } = req.body;
 if (!userText) {
   return res.status(400).json({ error: 'userText is required.' });
 }

 let aiText;
 try {
   const promptText = createContextualizedPrompt(userText, conversationHistory);

   const geminiResponse = await axios.post(
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
     {
       contents: [{
         parts: [{
           text: promptText
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

 const language = detectLanguage(aiText);
 const localizedMessages = getLocalizedMessages(language);

 const emergencyKeywords = language === 'fr' 
   ? ['urgence', 'urgent', 'immédiat', 'hôpital', 'critique', 'grave']
   : ['emergency', 'urgent', 'immediate', 'hospital', 'critical'];
 
 const urgencyLevels = {
   EMERGENCY: emergencyKeywords.some(keyword => aiText.toLowerCase().includes(keyword)),
   URGENT: language === 'fr' 
     ? /urgent|24 heures|plus tôt possible/.test(aiText.toLowerCase())
     : /urgent|24 hours|soon as possible/.test(aiText.toLowerCase())
 };

 let evaluationMessage = urgencyLevels.EMERGENCY 
   ? localizedMessages.emergency 
   : urgencyLevels.URGENT 
     ? localizedMessages.urgent 
     : localizedMessages.routine;

 let ttsBuffer;
 try {
   const ttsResponse = await axios.post(
     `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
     {
       text: `${aiText}\n\n${evaluationMessage}`,
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

 const updatedHistory = [
   ...conversationHistory,
   { role: 'user', content: userText },
   { role: 'assistant', content: aiText }
 ];

 const responseData = {
   text: {
     aiResponse: aiText,
     evaluation: evaluationMessage
   },
   audioBuffer: Array.from(new Uint8Array(ttsBuffer)),
   conversationHistory: updatedHistory
 };

 res.setHeader('Content-Type', 'application/json');
 return res.status(200).json(responseData);
}
