# MedicalGuide - AI-Powered Voice Assistant for Health

🚀 **MedicalGuide** is an AI-powered voice assistant built to provide **real-time health guidance** using cutting-edge AI technologies. This project was developed for the ElevenLabs AI Agents Hackathon and showcases the integration of **speech synthesis (TTS), speech recognition (STT), and LLM-based medical assistance**.

🔗 **Live Demo**: [MedicalGuide](https://medicalguide-28g22hl95-oortcloudds-projects.vercel.app/) *(Click to Try It!)*

## ✨ Features

✅ **Conversational AI** – Ask medical-related questions, and the assistant provides real-time voice responses.  
✅ **ElevenLabs TTS** – Natural, human-like speech synthesis for engaging interactions.  
✅ **RAG** – RAG added for increased reliability
✅ **Gemini 2.0 Flash** – Intelligent responses trained on medical knowledge.  
✅ **Optimized for Accessibility** – Hands-free interaction for visually impaired users.  
✅ **Deployed on Vercel** – Fast and scalable hosting.  

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org) (React, Tailwind CSS for styling)
- **Backend**: Next.js API Routes, Node.js
- **AI Models**: Gemini 2.0 Flash
- **Speech Synthesis**: [ElevenLabs API](https://elevenlabs.io)
- **Hosting**: Vercel (for frontend and backend API deployment)
- **Analytics (In Progress)**: PostHog (user behavior tracking, optional)
- **Automation (In Progress)**: Make (Integromat) for external workflows

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/yourusername/medicalguide.git
cd medicalguide

# Install dependencies
npm install  # or yarn install
```

### Running Locally

Start the development server:

```bash
npm run dev  # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the project in action.

## 🔑 API Configuration

Before running, create a `.env.local` file in the root directory and add your API keys:

```ini
GEMINI_API_KEY=your-gemini-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_MODEL_ID=your-elevenlabs-model-id
POSTHOG_API_KEY=your-posthog-api-key (optional)
```

## 📦 Deployment

Deploying to Vercel is seamless:

```bash
vercel
```

Or manually deploy from the [Vercel Dashboard](https://vercel.com/new).

## 📸 Screenshots

*(Add relevant screenshots of the app UI and interactions here.)*

## 🤖 How It Works

1. User clicks the microphone button and speaks a question.
2. The voice input is converted to text using STT.
3. The text query is processed by Gemini to generate a response.
4. The AI-generated response is synthesized into speech using ElevenLabs.
5. The voice assistant speaks the answer back to the user.

## 🎯 Why This Project Matters

🔹 **Accessible Healthcare** – Provides quick, AI-powered medical insights.  
🔹 **Voice-First Interaction** – Enables hands-free assistance, crucial for visually impaired individuals.  
🔹 **Scalable AI Assistant** – Future iterations can expand beyond ophthalmology to general medicine.

## 👨‍💻 Contributions & Future Work

We welcome contributions! Here are potential improvements:
- **Fine-tuning Gemini for medical accuracy** 📚
- **Adding multi-language support** 🌍
- **Expanding to other medical domains** 🏥
- **Enhancing real-time AI response speed** ⚡

## 💡 Learn More

To dive deeper into the technologies used:
- [Next.js Documentation](https://nextjs.org/docs)
- [ElevenLabs API Docs](https://elevenlabs.io)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 📜 License

This project is open-source under the MIT License. Feel free to fork and enhance!

## 🙌 Connect

👤 **Your Name**  
📧 [louissi.nassim@gmail.com](mailto:louissi.nassim@gmail.com)  
🔗 [LinkedIn](www.linkedin.com/in/nassimlouissi) | [GitHub](https://github.com/OortCloudd) | [Portfolio][Coming soon !]

---

⭐ **If you found this project interesting, give it a star!** ⭐

