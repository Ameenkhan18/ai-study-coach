# 📚 AI Study Coach — Chat with Your PDFs

A personal AI tutor powered by Claude that lets you upload PDF study materials and interact with them through multiple learning modes.

![AI Study Coach](https://img.shields.io/badge/Built%20with-Claude%20Sonnet-5B4FE8?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square)

## ✨ Features

- **📤 PDF Upload** — Drop any PDF up to 10MB; text is extracted and sent as context
- **💬 5 Study Modes**:
  - **Chat** — Free-form Q&A with your documents
  - **Explain** — Concept explanations in plain English
  - **Quiz** — Auto-generated questions to test knowledge
  - **Summarize** — Structured, scannable summaries
  - **Flashcards** — Q&A pairs for memorization
- **⚡ Streaming responses** — See answers appear in real time
- **📱 Responsive** — Works on mobile and desktop

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/ai-study-coach.git
cd ai-study-coach
npm install
```

### 2. Set up environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

Set the environment variable when prompted, or add it in the Vercel dashboard under **Settings → Environment Variables**:
```
ANTHROPIC_API_KEY = your_key_here
```

### Option B: Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add `ANTHROPIC_API_KEY` under Environment Variables
4. Deploy!

## 📁 Project Structure

```
ai-study-coach/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Streaming chat endpoint
│   │   └── upload/route.ts    # PDF extraction endpoint
│   ├── globals.css            # Design system & styles
│   ├── layout.tsx
│   └── page.tsx               # Main app shell
├── components/
│   ├── ChatInput.tsx          # Message input bar
│   ├── ChatMessage.tsx        # Message bubble with Markdown
│   ├── PDFUploader.tsx        # Drag & drop PDF uploader
│   ├── Sidebar.tsx            # Left panel
│   ├── StudyModeSelector.tsx  # Mode switcher
│   └── WelcomeScreen.tsx      # Empty state with suggestions
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Helper functions
├── .env.local.example
├── vercel.json
└── next.config.js
```

## 🔑 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Framework (App Router) |
| Anthropic SDK | Claude Sonnet AI |
| pdf-parse | PDF text extraction |
| react-dropzone | Drag & drop uploads |
| react-markdown | Render AI responses |
| Tailwind CSS | Styling |
| Vercel | Deployment |

## 📝 Notes

- PDFs must contain selectable text (not scanned images)
- Max PDF size: 10MB
- Document text is truncated at ~15,000 chars per document for API limits
- No database — all state is in-memory per session

## License

MIT
