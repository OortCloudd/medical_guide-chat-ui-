export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Convert text to speech (e.g., using ElevenLabs)
    res.status(200).json({ audioUrl: "https://example.com/audio.mp3" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
