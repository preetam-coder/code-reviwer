Code Reviewer
live-->https://code-reviwer-1-xsi4.onrender.com/

Code Reviewer is a web app that uses Google Gemini to analyze code and provide clear, actionable feedback. Paste code into the editor and click Review code to see suggestions in the review panel.
Features
- AI code reviews: Highlights potential bugs, security risks, performance issues, readability problems, and coding-style improvements.
- Multiple programming languages: Gemini reviews the code based on its contents. The editor currently labels and highlights code as JavaScript.
- Readable feedback: Displays the review as formatted Markdown, including explanations and example improvements.
- Input validation: Prompts users to add code before submitting an empty review request.
- Request feedback: Shows a loading state while Gemini works and provides an error message if the service is unavailable or takes too long.
- Backend API: A Node.js and Express server handles review requests and keeps the Gemini API key on the server.
- Health endpoint: /health reports whether the backend is running.
- Render deployment: The Express server can serve the built frontend and API from one Render web service.
What it does
The app sends the code from the editor to the backend. The backend asks Gemini to review it and returns the suggestions to the frontend, where they appear beside the editor. The API key is configured as an environment variable and should not be committed to the repository.
