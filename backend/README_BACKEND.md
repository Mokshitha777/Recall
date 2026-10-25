# Recall — Learn From Every Round (backend)

Spring Boot 3.5 / Java 21 / PostgreSQL backend. This upgraded backend adds user registration/login (JWT), per-user interview records, learning topics, dashboard summaries, validation, and optional AI coaching endpoints.

## Local setup
1. Use Java 21 and PostgreSQL.
2. Create `recall_db` in pgAdmin.
3. In IntelliJ Run Configuration > Environment variables set `DB_URL=jdbc:postgresql://localhost:5432/recall_db`, `DB_USERNAME=postgres`, and `DB_PASSWORD` to your local PostgreSQL password.
4. Set `APP_JWT_SECRET` to a private random value of at least 32 bytes. The bundled fallback is for local development only.
5. Run `BackendApplication`.

## AI configuration
AI endpoints are real provider-backed integrations but require a provider key. Set `AI_API_KEY` locally (never commit it). Optional: `AI_MODEL` (default `gpt-4o-mini`) and `AI_BASE_URL` (default `https://api.openai.com/v1`). Without a key, `/api/ai/health` reports unavailable and AI actions return HTTP 503; core app features still work.

## API overview
Public:
- `POST /api/auth/register` `{ "name":"Ada", "email":"ada@example.com", "password":"a-strong-password" }`
- `POST /api/auth/login` `{ "email":"ada@example.com", "password":"a-strong-password" }`
- `GET /api/ai/health`

Protected (send `Authorization: Bearer <token>`):
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET|POST /api/interviews`; `GET|PUT|DELETE /api/interviews/{id}`
- `GET|POST /api/learning-topics`; `GET|PUT|DELETE /api/learning-topics/{id}`
- `POST /api/ai/analyze-interview`, `/api/ai/generate-questions`, `/api/ai/study-plan`, body `{ "content":"...", "company":"...", "role":"...", "roundName":"..." }`

Interview body fields: `company` (required), `role` (required), `interviewDate` (YYYY-MM-DD), `roundName`, `outcome`, `location`, `experienceLevel`, `questions`, `notes`, `lessonsLearned`.
Learning topic body fields: `title` (required), `category`, `description`, `status` (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), `progress` (0–100), `targetDate` (ISO local datetime), `notes`.

## Important frontend note
The old frontend is not yet compatible with JWT authentication and the expanded APIs. It must be updated to include login/register, store/use the returned token, and send the Bearer token on protected requests. Do not expect the old UI to work unchanged against this secured backend.

## Security notes
Passwords are BCrypt-hashed. Interview records and learning topics are scoped to the authenticated user. For deployment, replace the local JWT secret, configure HTTPS, restrict CORS to your deployed origin, and use a managed secret store.


Serialization fix: entity user relationships are excluded from JSON responses to prevent lazy-proxy serialization errors. Existing database rows are not deleted by this code change. Restart the backend after replacing source files.
