# 📚 AI Study Coach

A simple project I built to make studying from PDFs easier. Instead of reading long documents manually, you can upload your notes or books and ask questions about them. The app also helps by explaining concepts, generating quizzes, creating flashcards, and summarizing content.

## Features

* Upload PDF files (up to 10 MB)
* Chat with your study materials
* Explain difficult concepts in simple words
* Generate quiz questions automatically
* Create short summaries
* Generate flashcards for revision
* Streaming responses for a smoother experience
* Responsive UI for desktop and mobile

## Tech Stack

* **Next.js 14** (App Router)
* **TypeScript**
* **Tailwind CSS**
* **Anthropic Claude Sonnet**
* **pdf-parse**
* **react-dropzone**
* **react-markdown**
* **Vercel** for deployment

## How It Works

1. Upload a PDF file.
2. The text is extracted using `pdf-parse`.
3. Extracted content is sent as context to Claude Sonnet.
4. Depending on the selected mode, the AI responds with answers, explanations, quizzes, summaries, or flashcards.
5. Responses are streamed in real time.

## Available Modes

### Chat Mode

Ask questions directly from the uploaded document.

### Explain Mode

Get concepts explained in simple language.

### Quiz Mode

Generate practice questions to test understanding.

### Summarize Mode

Get concise summaries of lengthy chapters.

### Flashcard Mode

Create question-answer pairs for quick revision.

## Project Structure

```
app/
├── api/
│   ├── chat/route.ts
│   └── upload/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── ChatInput.tsx
├── ChatMessage.tsx
├── PDFUploader.tsx
├── Sidebar.tsx
├── StudyModeSelector.tsx
└── WelcomeScreen.tsx

lib/
├── types.ts
└── utils.ts
```

## Running Locally

Clone the repository:

```bash
git clone <repository-url>
cd ai-study-coach
npm install
```

Create a `.env.local` file and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

## Deployment

I deployed the project on Vercel. After connecting the GitHub repository, I added the `ANTHROPIC_API_KEY` environment variable and deployed the app.

## Future Improvements

* Support multiple PDFs at once
* Store chat history in a database
* Add OCR support for scanned PDFs
* Save flashcards and quizzes for later revision
* Export notes and summaries

## License

MIT
