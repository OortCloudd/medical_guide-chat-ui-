import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAudioUrl(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText: text }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Error generating response.');
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
    setLoading(false);
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">Ask Your Medical Assistant</h2>
          <p className="text-gray-600 mb-6 text-center">
            Describe your symptoms or questions below. Our AI will evaluate your diagnosis and assess if you need immediate medical attention.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="textInput" className="block text-sm font-medium text-gray-700">
                Describe your symptoms or question:
              </label>
              <textarea
                id="textInput"
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="E.g. I've been experiencing severe chest pain and shortness of breath..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Get Diagnosis'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
          {audioUrl && (
            <div className="mt-8">
              <audio controls src={audioUrl} className="w-full" />
            </div>
          )}
          <p className="mt-6 text-xs text-gray-500 text-center">
            <em>Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.</em>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Medical Assistant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
