# textReview

A web app for uploading, pasting, and reviewing text documents (CVs, essays, reports, etc.) with AI-powered feedback and summarization.

## Features
- Upload or paste text files (PDF, DOCX, TXT, etc.)
- Select document type (CV, essay, report, article, business email, generic text)
- Get AI-generated summaries and actionable feedback
- Modern Vue.js frontend and Node.js/Express backend

## Prerequisites
- Node.js (v20+ recommended)
- npm (v9+ recommended)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/RuneSmedhaugen/textReview.git
   cd textReview
   ```
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend/client
   npm install
   ```

## Running the App
1. Start the backend server:
   ```bash
   cd server
   node app.js
   ```
2. Start the frontend dev server:
   ```bash
   cd ../frontend/client
   npm run dev
   ```
3. Open your browser and go to `http://localhost:5173` (or the port shown in the terminal).

## Usage
- Upload a file or paste text.
- Select the document type.
- Click "Submit" to get feedback and summary.

## Development
- Backend: Express, Xenova/transformers for AI
- Frontend: Vue.js, Bootstrap
- To add new document types or improve prompts, edit `server/ai.js`.

## Contributing
Pull requests and issues are welcome!

## License
MIT (or specify your preferred license)

---
For questions or help, contact Rune Smedhaugen or open an issue on GitHub.
