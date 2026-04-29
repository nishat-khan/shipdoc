---
name: "User Authentication System"
overview: "Add OAuth2-based authentication with Google and GitHub providers, session management via JWTs, and role-based access control for the API layer."
todos:
  - id: "1"
    content: "Set up OAuth2 provider configuration"
    status: "completed"
  - id: "2"
    content: "Implement Google login flow"
    status: "completed"
  - id: "3"
    content: "Implement GitHub login flow"
    status: "in_progress"
  - id: "4"
    content: "Add JWT session middleware"
    status: "pending"
  - id: "5"
    content: "Implement role-based access control"
    status: "pending"
  - id: "6"
    content: "Write integration tests"
    status: "pending"
---

# User Authentication System

## Design Decisions

- Use short-lived access tokens (15 min) with rotating refresh tokens for security
- Store refresh tokens in an HTTP-only cookie, access tokens in memory
- Roles are embedded in the JWT claims to avoid DB lookups on every request

## System Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant OAuth Provider
    participant DB

    User->>Frontend: Click "Login with Google"
    Frontend->>API: GET /auth/google
    API->>OAuth Provider: Redirect to consent screen
    OAuth Provider->>API: Callback with auth code
    API->>OAuth Provider: Exchange code for tokens
    API->>DB: Upsert user record
    API->>Frontend: Set refresh cookie + return access token
```

```mermaid
graph TD
    A[Request] --> B{Has valid JWT?}
    B -->|Yes| C{Check role claim}
    B -->|No| D[401 Unauthorized]
    C -->|Authorized| E[Allow request]
    C -->|Insufficient| F[403 Forbidden]
```

## API Endpoints

- `GET /auth/google` — Initiate Google OAuth flow
- `GET /auth/github` — Initiate GitHub OAuth flow
- `GET /auth/callback` — Handle provider callback
- `POST /auth/refresh` — Refresh access token
- `POST /auth/logout` — Revoke session

## Data Model

- **users** table: id, email, name, avatar_url, provider, provider_id, role, created_at
- **sessions** table: id, user_id, refresh_token_hash, expires_at, created_at

## Security Considerations

- CSRF protection via SameSite cookies + double-submit pattern
- Rate limiting on auth endpoints (10 req/min per IP)
- Token rotation: each refresh invalidates the previous token
