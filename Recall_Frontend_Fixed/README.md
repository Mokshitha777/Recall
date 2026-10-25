# Recall Frontend — corrected API integration

React + Vite frontend for Recall — Learn From Every Round.

## Run
1. Extract this ZIP into a new folder.
2. Open that folder in VS Code.
3. In Terminal, run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:5173/`.

Keep the Spring Boot backend running on `http://localhost:8080`.

## Backend routes verified against the supplied Recall backend source
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET/POST /api/interviews`
- `PUT/DELETE /api/interviews/{id}`
- `GET/POST /api/learning-topics`
- `PUT/DELETE /api/learning-topics/{id}`
- `POST /api/ai/analyze-interview` (request `content`, `company`, `role`, `roundName`; response `result`)
- `GET /api/ai/health`

## Data behavior
No sample Amazon/example interview entries or seeded learning topics are included. A signed-in user sees only data returned for that account by the backend. New accounts should start empty. Learning progress is saved through the backend when a progress button is clicked.

## Important
- The frontend does not delete or migrate database data.
- Keep the old `recall_db` unchanged if it contains data you need. Point the new backend at a separate database if that is your plan.
- AI Coach requires the backend AI key to be configured; a working frontend route alone does not provide an AI key.
- Never commit database passwords, JWT secrets, or AI provider keys to GitHub.
