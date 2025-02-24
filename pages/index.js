import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const audioRef = useRef(null);

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setText(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      // Stockage de l'instance de reconnaissance pour y accéder globalement
      window.recognition = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      window.recognition?.stop();
      setIsListening(false);
    } else {
      window.recognition?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAudioUrl(null);
    setResponseText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText: text, conversationHistory }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la génération de la réponse.');
      }

      const data = await res.json();

      // Mise à jour de la réponse et de l'historique de conversation
      setResponseText(`${data.text.aiResponse}\n${data.text.evaluation}`);
      setConversationHistory(data.conversationHistory);

      // Création et lecture de l'audio
      const audioBuffer = new Uint8Array(data.audioBuffer).buffer;
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Une erreur inattendue est survenue.');
    }
    setLoading(false);
    setText(''); // Réinitialisation du champ texte après envoi
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-teal-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-blue-800 animate-fadeIn">Medical Assistant</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition">Home</a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition">About</a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">Ask Your Medical Assistant</h2>

          <div className="mb-8 bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">Welcome to your AI Medical Assistant. You can:</p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Type your symptoms or medical questions</li>
              <li>Use voice input by clicking the microphone button</li>
              <li>Get both text and voice responses</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your symptoms or question:
              </label>
              <div className="relative">
                <textarea
                  id="textInput"
                  rows="4"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="E.g. I've been experiencing severe chest pain..."
                />

                {/* Bouton d'entrée vocale */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute bottom-3 right-3 p-2 rounded-full 
                    ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white
                    hover:${isListening ? 'bg-red-600' : 'bg-blue-600'} transition-colors`}
                  title={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-md
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                text-white font-semibold transition-colors duration-200`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Get Medical Guidance'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Affichage de la dernière réponse */}
          {responseText && (
            <div className="mt-8 space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Medical Assistant Response:</h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{responseText}</p>
                </div>
              </div>

              {/* Lecteur audio caché (pour l'auto-play) */}
              <audio
                ref={audioRef}
                src={audioUrl}
                className="hidden"
                autoPlay
                controls
              />

              {/* Contrôles audio visibles */}
              {audioUrl && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">You can replay the audio response:</p>
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}
            </div>
          )}

          {/* Affichage complet de l'historique de la conversation */}
          {conversationHistory.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Conversation History:</h3>
              {conversationHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${msg.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-50'}`}
                >
                  <strong>{msg.role === 'assistant' ? 'Assistant' : 'Patient'}: </strong>
                  {msg.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Medical Assistant. All rights reserved.
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            This is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}
