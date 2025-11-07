# textReview

A web app for uploading, pasting, and reviewing text documents (CVs, essays, reports, articles, business emails, etc.) with **AI-powered feedback and summarization**.  

The app uses **Ollama LLaMA models** to provide actionable insights and tailored feedback based on the type of document.

## Features

- Upload or paste text files (.pdf, .docx, .doc, .txt)
- Select document type for tailored feedback:
  - CV / Resume
  - Essay
  - Report
  - Article
  - Business Email
  - Generic Text
- Get AI-generated summaries and constructive feedback
- Dark mode-enabled, professional UI
- Modern **Vue 3** frontend and **Node.js / Express** backend

## Prerequisites

- **Node.js** v20+
- **npm** v9+
- **Ollama AI** installed locally  

To install Ollama, follow instructions here: [https://ollama.com](https://ollama.com)  

After installing, pull the model used for analysis:

`ollama pull llama3`

## Installation

1. Clone the repository:

`git clone https://github.com/RuneSmedhaugen/textReview.git`
`cd textReview`

2. Install backend dependencies:

`cd server`
`npm install`

3. Install frontend dependencies:

`cd ../frontend/client`
`npm install`

## Running the App

1. Start the backend server:

`cd server`
`node app.js`

The backend will run at `http://localhost:5000`.

2. Start the frontend dev server:

`cd ../frontend/client`
`npm run dev`

The frontend will run at `http://localhost:5173` (or the port shown in the terminal).

3. Open the app in your browser:

- Upload a file or paste text.
- Select the appropriate document type.
- Click **Submit** to get AI-generated feedback and summary.

## Usage Notes

- Selecting the correct **document type** ensures the AI provides tailored, accurate feedback.
- Both uploaded files and pasted text are supported.
- AI feedback includes suggestions on **strengths, weaknesses, and improvements**.
- Dark mode is enabled for comfortable reading.
- Placeholder text, labels, and instructions are styled for visibility in dark mode.

## Development

- **Backend:** Express, Ollama LLaMA model integration (`server/ai.js`)  
- **Frontend:** Vue 3, Bootstrap 5  
- To add new document types or improve feedback prompts, edit `server/ai.js`.
- For file handling, the backend supports `.pdf`, `.docx`, `.txt` formats.
- Frontend uses Axios for API requests and provides a file upload interface and text area input.

## Contributing

Pull requests and issues are welcome! If you have suggestions for new features, UI improvements, or AI prompt refinements, feel free to open an issue or submit a PR.

## License

MIT (or specify your preferred license)

For questions or help, contact Rune Smedhaugen or open an issue on GitHub.
