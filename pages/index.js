import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to send the chat message to your chat API (Gemini integration)
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponseText("");

    try {
      // Replace this fetch with your Gemini chat endpoint call as needed
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      const reply = data.reply || "No response received.";
      setResponseText(reply);

      // Now call the ElevenLabs TTS API route
      fetchTTS(reply);
    } catch (error) {
      setResponseText("Error fetching response.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to call the ElevenLabs TTS API route and play the returned audio
  const fetchTTS = async (replyText) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText })
      });

      if (!res.ok) {
        console.error("TTS API call failed.");
        return;
      }

      // Convert the response to a Blob and create a URL for audio playback
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error fetching TTS audio:", error);
    }
  };

  // Example UI with a text input and buttons
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Voice Assistant with ElevenLabs TTS</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question..."
        style={{ padding: "0.5rem", width: "60%" }}
      />
      <button
        onClick={handleSendMessage}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Send
      </button>
      <div style={{ marginTop: "1rem" }}>
        {loading ? <p>Loading...</p> : <p>{responseText}</p>}
      </div>
    </div>
  );
}

