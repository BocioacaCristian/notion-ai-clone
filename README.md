# Notion AI Clone

A simplified version of Notion with AI-powered writing features built with Next.js, TypeScript, Tiptap, and OpenAI.

## Features

- ✍️ **Rich Text Editor** (using Tiptap)
  - Bold/italic formatting
  - Headings, lists, code blocks
  - Block-based editing
  - Markdown support

- 🤖 **AI-Powered Tools** (via OpenAI API)
  - Continue writing
  - Summarize text
  - Fix grammar
  - Translate to different languages
  - Improve writing
  - Make text shorter or longer

- 📦 **Document Management**
  - Create, edit, and delete documents
  - Local storage for saving documents
  - Automatic saving

## Tech Stack

- **Frontend**: React + TypeScript with Next.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Editor**: Tiptap
- **State Management**: Zustand
- **AI API**: OpenAI

## Getting Started

### Prerequisites

- Node.js 16+ (we used Node.js 22)
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/notion-ai-clone.git
   cd notion-ai-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
  - `src/components/editor`: Editor-related components
  - `src/components/ui`: UI components from shadcn/ui
- `src/hooks`: Custom React hooks
- `src/services`: API and service layers
- `src/stores`: State management with Zustand
- `src/types`: TypeScript types and interfaces
- `src/utils`: Utility functions

## License

MIT

## Acknowledgements

- [Tiptap](https://tiptap.dev/) - The editor framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [OpenAI](https://openai.com/) - AI capabilities
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
