export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process the incoming audio (e.g., call OpenAI or ElevenLabs API)
    res.status(200).json({ text: "Simulated text response from audio" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
