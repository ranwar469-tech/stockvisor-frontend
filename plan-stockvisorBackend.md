# Implementation Document: StockVisor Frontend + Backend (Current State)

**TL;DR:** StockVisor is fully implemented as a React + Vite frontend and a FastAPI backend in a sibling folder. Authentication is delegated to Supabase Auth, API authorization is done by validating Supabase JWTs through JWKS, app data is persisted in PostgreSQL via SQLAlchemy, and market/news/AI data is served through yfinance, Finnhub, and Hugging Face inference.

---

## Current Full-Stack State (as of Mar 2026)

### Frontend Stack
- React 19 + React Router
- Vite
- Tailwind-style utility classes
- Axios client with interceptors
- lucide-react icons
- react-google-charts
- react-chartjs-2 + Chart.js
- recharts

### Backend Stack
- FastAPI
- SQLAlchemy + PostgreSQL
- Supabase Auth (GoTrue) for user auth lifecycle
- Supabase JWKS validation for bearer tokens
- yfinance for market data and symbol search
- Finnhub for market news and analyst recommendations
- Hugging Face Inference API for sentiment and AI alert summaries

---

## 1. Repository Layout (Implemented)

### Frontend (`stockvisor-frontend`)
```
src/
  main.jsx
  App.jsx
  services/
    api.js
  context/
    AuthContext.jsx
  hooks/
    useAuth.jsx
    useTheme.jsx
  pages/
    Home.jsx
    Portfolio.jsx
    Community.jsx
    DiscussionThread.jsx
    AdminDashboard.jsx
    News.jsx
    Tips.jsx
    About.jsx
    AccountSettings.jsx
    Login.jsx
    Register.jsx
  components/
    Layout.jsx
    ProtectedRoute.jsx
    AdminRoute.jsx
    AnalystChart.jsx
    StockHeatmap.jsx
    StocksTable.jsx
    AreaChartPortfolio.jsx
    PortfolioRadarChart.jsx
    Discussion.jsx
    AIInsightsSidebar.jsx
    TipsComponent.jsx
    TutorialPopup.jsx
    StockWdgets.jsx
```

### Backend (`stockvisor-backend`)
```
app/
  main.py
  database.py
  core/
    config.py
    security.py
  models/
    __init__.py
    user.py
    portfolio.py
    watchlist.py
    saved_news.py
    discussion.py
  schemas/
    auth.py
    admin.py
    portfolio.py
    stocks.py
    discussions.py
    insights.py
  routes/
    auth.py
    admin.py
    portfolio.py
    watchlist.py
    stocks.py
    heatmap.py
    insights.py
    discussions.py
```

---

## 2. Frontend Architecture and Responsibilities

### App Bootstrap and Routing
- `main.jsx` mounts React app, router, and auth provider.
- `App.jsx` defines route graph.
- `/login` and `/register` are public auth pages.
- Main app routes (`/`, `/portfolio`, `/community`, `/news`, `/tips`, `/about`, `/settings`) are rendered under `Layout.jsx`.
- Admin route (`/admin`) is protected by `AdminRoute.jsx` and accessible only when `user.role === "admin"`.

### Global Service and State Layer
- `services/api.js`
  - Uses `VITE_API_URL` with default `http://localhost:8000`.
  - Injects `Authorization: Bearer <token>` from `localStorage` key `sv_token`.
  - On API `401` (except login/register), clears auth storage and dispatches `auth:expired` event.
- `context/AuthContext.jsx`
  - Stores current user, loading state, auth methods (`login`, `register`, `logout`, `updateUser`).
  - Restores session from `sv_token` + `sv_user`.
  - Subscribes to `auth:expired` for centralized forced logout behavior.
- `hooks/useTheme.jsx`
  - Persists dark/light theme in `localStorage` key `theme`.

### Layout and Cross-Cutting UI
- `components/Layout.jsx`
  - Header, nav, footer.
  - User menu (about, login/logout, settings).
  - Role-aware navbar link for admin users.
  - Theme switch.
  - Floating action button that opens `AIInsightsSidebar`.

### Feature Pages
- `pages/Home.jsx`
  - Market cards (market status, AI sentiment, stock count).
  - Renders `AnalystChart`, `StockHeatmap`, `StocksTable`.
  - Uses `TutorialPopup` for contextual walkthroughs.
- `pages/Portfolio.jsx`
  - Auth-gated actions for add/sell holdings.
  - Fetches and renders holdings table and portfolio metrics.
  - Uses `AreaChartPortfolio` and `PortfolioRadarChart`.
  - Uses autocomplete stock search for add/sell forms.
- `pages/Community.jsx`
  - Renders `Discussion` list module.
  - Builds top contributor leaderboard by combining thread and post data.
  - Supports admin manage mode UX entry from admin dashboard.
- `pages/DiscussionThread.jsx`
  - Thread detail view, posting, deleting own posts/thread, like/unlike posts.
  - Admin users can delete any thread or post through admin endpoints.
- `pages/AdminDashboard.jsx`
  - Admin-only control panel.
  - Lists all users.
  - Supports ban/unban and account deletion actions.
  - Includes community moderation shortcut to `/community?adminManage=1`.
- `pages/News.jsx`
  - Latest feed and saved articles tabs.
  - Save/unsave actions for authenticated users.
- `pages/Tips.jsx`
  - Static educational tips catalog.
  - Renders detail via `TipsComponent`.
- `pages/AccountSettings.jsx`
  - Profile update, password change, account deletion.
- `pages/Login.jsx` and `pages/Register.jsx`
  - Form UX, validation, submit states, backend auth integration.

### Reusable Data Widgets
- `AnalystChart.jsx`: symbol search + analyst recommendation chart.
- `StockHeatmap.jsx`: Google TreeMap from heatmap API payload.
- `StocksTable.jsx`: quote table, favorites tab, watchlist sync.
- `AreaChartPortfolio.jsx`: invested vs current value progression chart.
- `PortfolioRadarChart.jsx`: sector allocation radar.
- `Discussion.jsx`: list/create/delete threads module.
- `AIInsightsSidebar.jsx`: market overview, sector sentiment, AI alerts.
- `TutorialPopup.jsx`: generic instructional modal used across dashboard/portfolio widgets.
- `StockWdgets.jsx`: TradingView embed component (currently not wired into main pages).

---

## 3. Backend Runtime Architecture

### Application Bootstrap
- `app/main.py`
  - Creates FastAPI app.
  - Creates DB tables on startup (`Base.metadata.create_all`).
  - Applies lightweight schema safety check for missing `profiles.role` column in older databases.
  - Registers all routers.
  - CORS configured with broad allow settings (`*`).

### Config and Environment
- `app/core/config.py`
  - Reads: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `FINNHUB_API_KEY`, `HF_TOKEN`.

### Database Layer
- `app/database.py`
  - SQLAlchemy engine/session/base.
  - Dependency `get_db()` for route injection.

### Auth and Security
- `app/core/security.py`
  - Uses OAuth2 bearer extraction.
  - Validates JWT via Supabase JWKS endpoint and ES256 signature.
  - Resolves authenticated user against local `profiles` table.
  - Enforces admin-only access through `get_current_admin` dependency.

---

## 4. Database Models (Implemented)

### `profiles` (`models/user.py`)
- `id` (Supabase user UUID)
- `username` (unique)
- `email` (unique)
- `role` (`user` or `admin`)
- `created_at`

### `holdings` (`models/portfolio.py`)
- `id`
- `user_id` (FK to profiles.id)
- `symbol`
- `name`
- `sector`
- `quantity`
- `purchase_price`
- `created_at`
- unique constraint: `(user_id, symbol)`

### `watchlist_items` (`models/watchlist.py`)
- `id`
- `user_id`
- `symbol`
- `added_at`
- unique constraint: `(user_id, symbol)`

### `saved_news` (`models/saved_news.py`)
- `id`
- `user_id`
- `external_id`
- `headline`, `source`, `url`, `image`, `summary`, `category`, `related`
- `published_at`, `saved_at`
- unique constraint: `(user_id, external_id)`

### `threads` and `posts` (`models/discussion.py`)
- Threads: category/title/creator/message_count/participating_users/json timestamps.
- Posts: thread_id/user_id/message/likes/liked_user_ids/json timestamps.

---

## 5. API Contracts (Implemented Endpoints)

### Auth (`/auth`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| POST | `/auth/register` | Creates Supabase user, creates local profile, returns access token + local user |
| POST | `/auth/login` | Password grant via Supabase, ensures local profile exists, returns token + user |
| GET | `/auth/me` | Returns current authenticated local profile |
| PATCH | `/auth/profile` | Updates username and/or email |
| PATCH | `/auth/password` | Verifies current password then updates password in Supabase |
| DELETE | `/auth/account` | Deletes local holdings/watchlist/saved news/discussion data/profile and then deletes Supabase user |

### Admin (`/admin`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/admin/users` | Returns all local users with role and auth-provider ban status |
| POST | `/admin/users/{user_id}/ban` | Bans a user via Supabase Admin API |
| DELETE | `/admin/users/{user_id}/ban` | Removes an active ban via Supabase Admin API |
| DELETE | `/admin/users/{user_id}` | Deletes a user account in Supabase and local app data |
| DELETE | `/admin/threads/{thread_id}` | Admin deletes any community thread |
| DELETE | `/admin/posts/{post_id}` | Admin deletes any community post |

### Stocks + News (`/stocks`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/stocks/status` | US market status from yfinance |
| GET | `/stocks/quote/{symbol}` | Real-time quote payload for symbol |
| GET | `/stocks/search?q=` | Equity search results |
| GET | `/stocks/news` | Finnhub category news feed |
| GET | `/stocks/recommendations?symbol=` | Latest analyst recommendation trend from Finnhub |
| GET | `/stocks/news/saved` | Current user's saved articles |
| POST | `/stocks/news/saved` | Save article for current user |
| DELETE | `/stocks/news/saved/{saved_id}` | Delete saved article |

### Portfolio (`/portfolio`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/portfolio/` | Lists current user's holdings, enriched with live market prices |
| POST | `/portfolio/` | Adds holding or merges into existing symbol position |
| POST | `/portfolio/sell` | Sells quantity from a position; deletes row on full close |
| DELETE | `/portfolio/{holding_id}` | Deletes holding by id if owner |

### Watchlist (`/watchlist`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/watchlist/` | List watchlist symbols |
| POST | `/watchlist/` | Add symbol |
| DELETE | `/watchlist/{symbol}` | Remove symbol |

### Heatmap (`/api`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/api/heatmap` | Returns sector/stock market-cap + daily change dataset for heatmap tile rendering |

### Insights (`/insights`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/insights/technology` | Sector sentiment classification |
| GET | `/insights/energy` | Sector sentiment classification |
| GET | `/insights/healthcare` | Sector sentiment classification |
| GET | `/insights/financial` | Sector sentiment classification |
| GET | `/insights/alerts/` | AI summarized alert snippets from sampled news |

### Discussions (`/discussions`)
| Method | Endpoint | Behavior |
|--------|----------|----------|
| GET | `/discussions/threads` | List discussion threads |
| POST | `/discussions/threads` | Create thread |
| GET | `/discussions/threads/{thread_id}` | Thread detail with posts |
| PUT | `/discussions/threads/{thread_id}` | Update thread (creator only) |
| DELETE | `/discussions/threads/{thread_id}` | Delete thread (creator only) |
| POST | `/discussions/threads/{thread_id}/posts` | Add post |
| GET | `/discussions/threads/{thread_id}/posts` | List posts for thread |
| PUT | `/discussions/posts/{post_id}` | Update post (author only) |
| DELETE | `/discussions/posts/{post_id}` | Delete post (author only) |
| GET | `/discussions/posts/{post_id}/likes` | Get post likes + current-user liked state |
| POST | `/discussions/posts/{post_id}/likes` | Toggle like/unlike |

---

## 6. Frontend to Backend Integration Map

### Authentication lifecycle
1. Frontend submits login/register via `AuthContext`.
2. Backend proxies auth to Supabase and returns bearer token + profile.
3. Frontend stores `sv_token` and `sv_user`.
4. Every API request carries bearer token via interceptor.
5. Backend validates token signature via Supabase JWKS and resolves local profile.
6. On unauthorized responses, frontend auto-clears session and logs out.

### Home page flows
1. Market status card -> `GET /stocks/status`.
2. Analyst chart symbol search -> `GET /stocks/search`.
3. Analyst chart data -> `GET /stocks/recommendations`.
4. Heatmap widget -> `GET /api/heatmap`.
5. Popular stocks table quotes -> `GET /stocks/quote/{symbol}`.
6. Favorites persistence -> watchlist endpoints.

### Portfolio page flows
1. Initial table load -> `GET /portfolio/`.
2. Add modal search -> `GET /stocks/search`.
3. Add holding -> `POST /portfolio/`.
4. Sell holding -> `POST /portfolio/sell`.
5. Delete row -> `DELETE /portfolio/{id}`.
6. Same holdings dataset drives summary cards and both charts.

### Community flows
1. Thread list -> `GET /discussions/threads`.
2. New thread -> `POST /discussions/threads`.
3. Thread detail + posts -> `GET /discussions/threads/{id}`.
4. New post -> `POST /discussions/threads/{id}/posts`.
5. Delete permissions use owner checks for normal users, and admin endpoints for moderators.
6. Likes -> read/toggle post likes endpoints.

### Admin flows
1. Admin dashboard users table -> `GET /admin/users`.
2. Ban user -> `POST /admin/users/{id}/ban`.
3. Unban user -> `DELETE /admin/users/{id}/ban`.
4. Delete user account -> `DELETE /admin/users/{id}`.
5. Moderate community thread -> `DELETE /admin/threads/{id}`.
6. Moderate community post -> `DELETE /admin/posts/{id}`.

### News flows
1. Latest feed -> `GET /stocks/news`.
2. Saved list -> `GET /stocks/news/saved`.
3. Save article -> `POST /stocks/news/saved`.
4. Unsave article -> `DELETE /stocks/news/saved/{id}`.

### AI sidebar flows
1. Market mini-overview -> multiple `GET /stocks/quote/*` calls.
2. Sector sentiment -> sector insight endpoints.
3. AI alerts -> `GET /insights/alerts/`.

---

## 7. Environment and Runtime Requirements

### Backend `.env` keys
```env
DATABASE_URL=<postgres-connection-string>
SUPABASE_URL=<supabase-project-url>
SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
SUPABASE_JWT_SECRET=<supabase-jwt-secret>
FINNHUB_API_KEY=<finnhub-key>
HF_TOKEN=<huggingface-token>
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
```

### Backend dependencies (`requirements.txt`)
- fastapi
- uvicorn[standard]
- sqlalchemy
- psycopg2-binary
- pydantic[email]
- pydantic-settings
- PyJWT[crypto]
- python-multipart
- python-dotenv
- httpx
- yfinance

---

## 8. Verification Checklist (Current Implementation)

```bash
# Backend
cd stockvisor-backend
uvicorn app.main:app --reload

# Frontend
cd stockvisor-frontend
npm run dev
```

- [ ] Register creates Supabase user and local profile, and returns token + user payload.
- [ ] Login returns Supabase access token and local profile payload.
- [ ] Unauthorized API access triggers frontend auth reset via interceptor.
- [ ] Portfolio endpoints return enriched market values and support add/sell/delete.
- [ ] Stocks endpoints return quote/search/news/recommendation data.
- [ ] Watchlist persists favorites for authenticated users.
- [ ] Discussions support full thread/post/like lifecycle with ownership checks.
- [ ] Role-aware navbar shows Admin for admin users only.
- [ ] Admin dashboard loads user list and supports ban/unban/delete actions.
- [ ] Admins can delete any thread and post from community flows.
- [ ] News save/unsave works per user account.
- [ ] AI insights and alerts endpoints return valid inference payloads.

---

## 9. Key Technical Decisions (As Implemented)

- Supabase is the source of auth truth, while backend stores local profile and domain data.
- Bearer token validation is done against Supabase JWKS using ES256.
- Role-based authorization is enforced using local `profiles.role` plus route-level admin guards.
- SQLAlchemy models are auto-created at app startup for fast local iteration.
- Market and portfolio valuations are enriched at request-time from yfinance.
- News and analyst recommendations come from Finnhub.
- AI sentiment and alert text are generated through Hugging Face inference APIs.
- Frontend keeps routes broadly browsable while enforcing authentication at action level for protected operations.

---

## 10. Known Gaps and Next Hardening Steps

- Add robust automated tests under `stockvisor-backend/tests`.
- Tighten CORS `allow_origins` for production.
- Add server-side audit logs for admin moderation actions (ban/unban/delete).
- Add API-level caching/rate-limit handling for yfinance/Finnhub/Hugging Face calls.
- Add structured logging and centralized error telemetry.
- Add migration tooling (Alembic) instead of create-all-on-start for production schema control.