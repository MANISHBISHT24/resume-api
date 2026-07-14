# resume-api

Backend API for the AI Resume Builder — built for Full-Stack Internship, Module 4, Day 13 task.

No database yet. Data is stored in `data.json`, read into memory on start and
written back on every change. Auth and AI routes return mock responses.

## How to run

```bash
npm install
npm start
```

Server starts on `http://localhost:3000`.

To reset all data, restore `data.json` to its original contents (users,
templates, empty documents/applications/versions).

## Routes built

### Auth (`/api/auth`) — mocked, no real sessions

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Obtain an access token |
| POST | /api/auth/logout | Invalidate the session |
| POST | /api/auth/forgot-password | Begin password recovery |
| POST | /api/auth/reset-password | Complete password reset |

### Users (`/api/users`)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/users/me | Current profile, tier, AI credits |
| PUT | /api/users/me | Update profile |
| DELETE | /api/users/me | Delete account and data |

Pass an `X-User-Id` header to act as a specific user; defaults to the demo user.

### Documents (`/api/documents`) — the core resource

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/documents | List my resumes and cover letters |
| POST | /api/documents | Create one (blank or from a template) |
| POST | /api/documents/import | Create one from an upload or LinkedIn data |
| GET | /api/documents/:id | Read one with its full content |
| PUT | /api/documents/:id | Save edits |
| POST | /api/documents/:id/duplicate | Copy it (a tailored version) |
| DELETE | /api/documents/:id | Delete it |

### Sections & items (nested under a document)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/documents/:id/sections | Add a section |
| PATCH | /api/documents/:id/sections/:sectionId | Edit or reorder a section |
| DELETE | /api/documents/:id/sections/:sectionId | Remove a section |
| POST | /api/documents/:id/sections/:sectionId/items | Add an entry |
| PATCH | /api/documents/:id/sections/:sectionId/items/:itemId | Edit or reorder an entry |
| DELETE | /api/documents/:id/sections/:sectionId/items/:itemId | Remove an entry |

### Versions

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/documents/:id/versions | List saved versions |
| POST | /api/documents/:id/versions | Save the current state as a version |
| POST | /api/documents/:id/versions/:versionId/restore | Roll back to one |

### Templates (`/api/templates`) — read only

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/templates | List available designs |
| GET | /api/templates/:id | One template's config |

### AI (`/api/ai`) — mocked, metered against `aiCredits`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/ai/bullets | Generate or improve bullet points |
| POST | /api/ai/summary | Generate a summary or headline |
| POST | /api/ai/rewrite | Tighten or improve selected text |
| POST | /api/ai/prompt | Apply a freeform instruction to a section |

### Applications (`/api/applications`) — job tracker

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/applications | List tracked applications |
| POST | /api/applications | Log one |
| PATCH | /api/applications/:id | Update status |
| DELETE | /api/applications/:id | Remove one |

## Not built yet (mentioned as optional in the spec)

ATS check, tailoring, exports, and sharing — same pattern (POST for an action,
GET to read) can be added the same way as the AI routes.

## Example: quick manual test

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"My Resume"}'
```
