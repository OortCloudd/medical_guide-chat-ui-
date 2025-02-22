import { useState } from 'react';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState('');

  const handleRecord = async () => {
    // Here you would add code to record audio and send it to your STT API.
    console.log("Record button clicked");
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Voice Assistant</h1>
      <button onClick={handleRecord} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
        🎤 Record
      </button>
      {audioUrl && (
        <div style={{ marginTop: '1rem' }}>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

