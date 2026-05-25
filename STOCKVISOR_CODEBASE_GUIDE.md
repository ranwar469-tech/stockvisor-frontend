# StockVisor Codebase Guide

## Scope

This document summarizes the full StockVisor application across:

- `stockvisor-frontend` (current folder)
- `../stockvisor-backend` (sibling backend folder)

It explains:

- what features the app has
- how those features are implemented
- how data flows between frontend and backend
- how the codebase is structured

---

## 1. High-Level Overview

StockVisor is a full-stack stock market platform built around five main product areas:

1. Market dashboard
2. Portfolio tracking
3. Financial news
4. Community discussions
5. AI insights and learning/tutorial content

The frontend is a React 19 + Vite single-page application. The backend is a FastAPI application using SQLAlchemy and a Supabase-hosted PostgreSQL-compatible database, with Supabase also handling authentication.

External services used by the backend:

- Supabase Auth for user registration, login, JWT validation, ban/delete admin actions
- yFinance for market status, quotes, stock search support, portfolio enrichment, news source data, and heatmap data
- Finnhub for market news and analyst recommendation trends
- Hugging Face Inference API for AI sentiment and alert summarization

---

## 2. Frontend Structure

### Root structure

- `src/main.jsx`
  - bootstraps React
  - wraps the app in `BrowserRouter`
  - wraps the app in `AuthProvider`
- `src/App.jsx`
  - defines all application routes
  - applies theme globally with `useTheme()`
- `src/services/api.js`
  - central Axios client
  - injects JWT token into requests
  - emits `auth:expired` on non-auth `401` responses
- `src/context/AuthContext.jsx`
  - restores session from `localStorage`
  - exposes `login`, `register`, `logout`, `updateUser`, `isAuthenticated`
- `src/components/Layout.jsx`
  - shared shell for all non-auth pages
  - header, nav, footer, dark mode toggle, profile menu, AI insights sidebar

### Route map

- `/` → `Home`
- `/about` → `About`
- `/portfolio` → `Portfolio`
- `/community` → `Community`
- `/community/threads/:threadId` → `DiscussionThread`
- `/news` → `News`
- `/tutorials` → `Tips`
- `/settings` → `AccountSettings`
- `/admin` → `AdminDashboard` through `AdminRoute`
- `/login` → `Login`
- `/register` → `Register`

### Frontend folders

- `src/pages`
  - top-level screens
- `src/components`
  - reusable UI + feature widgets
- `src/context`
  - auth state
- `src/hooks`
  - theme and auth access hooks
- `src/services`
  - HTTP client
- `src/test`
  - setup and smoke tests

---

## 3. Backend Structure

### Main application files

- `app/main.py`
  - creates FastAPI app
  - creates tables on startup with `Base.metadata.create_all(bind=engine)`
  - registers CORS
  - mounts all routers
- `app/database.py`
  - SQLAlchemy engine, session factory, `Base`, and `get_db()`
- `app/core/config.py`
  - loads environment configuration from `.env`
- `app/core/security.py`
  - validates Supabase JWTs using JWKS
  - resolves current user from local `profiles` table
  - enforces admin access

### Backend folder layout

- `app/routes`
  - API endpoints grouped by feature
- `app/models`
  - SQLAlchemy models
- `app/schemas`
  - Pydantic request/response models
- `tests`
  - backend correctness, CRUD flow, and load-test files

### Registered routers

- `/auth`
- `/api` (heatmap)
- `/stocks`
- `/portfolio`
- `/watchlist`
- `/insights`
- `/discussions`
- `/admin`

---

## 4. Core Application Flow

### Startup flow

1. Frontend starts in `main.jsx`.
2. `AuthProvider` restores `sv_token` and `sv_user` from `localStorage`.
3. `App.jsx` loads routes and global theme behavior.
4. Shared pages render inside `Layout`, which also provides access to the AI Insights sidebar.

### Authenticated request flow

1. User logs in or registers from `Login.jsx` or `Register.jsx`.
2. `AuthContext` calls backend `/auth/login` or `/auth/register`.
3. Backend talks to Supabase Auth and returns:
   - `access_token`
   - local user profile
4. Frontend stores both in `localStorage`.
5. `api.js` attaches `Authorization: Bearer <token>` to later requests.
6. Backend validates the JWT with Supabase JWKS and maps `sub` to a local `Profile`.

### Expired session flow

1. Backend returns `401`.
2. Axios response interceptor removes `sv_token` and `sv_user`.
3. Interceptor dispatches `auth:expired`.
4. `AuthContext` listens for that event and logs the user out.

---

## 5. Features and How They Are Implemented

## 5.1 Authentication and User Accounts

### Frontend

- `Login.jsx`
  - controlled form for email/password
  - uses `useAuth().login()`
  - redirects back to intended route or `/`
- `Register.jsx`
  - client-side validation for username, email, password, confirm password
  - uses `useAuth().register()`
- `AccountSettings.jsx`
  - updates profile via `/auth/profile`
  - changes password via `/auth/password`
  - deletes account via `/auth/account`

### Backend

- `app/routes/auth.py`
  - `/auth/register`
    - checks local username uniqueness
    - creates Supabase account
    - creates local `Profile`
  - `/auth/login`
    - authenticates against Supabase password grant
    - ensures local `Profile` exists
  - `/auth/me`
    - returns current authenticated profile
  - `/auth/profile`
    - updates local username
    - updates email in Supabase admin API when changed
  - `/auth/password`
    - verifies current password with Supabase
    - updates password through Supabase user API
  - `/auth/account`
    - deletes local linked data
    - deletes Supabase auth account

### Data model

- `profiles`
  - `id`, `username`, `email`, `role`, `created_at`

### Important implementation detail

Authentication is hybrid:

- identity and JWT lifecycle live in Supabase
- app-specific profile/role data lives in the app database hosted on Supabase Postgres

---

## 5.2 Layout, Navigation, Theme, and Shared Shell

### Implemented in

- `src/components/Layout.jsx`
- `src/hooks/useTheme.jsx`

### What it does

- shared app shell for public app pages
- user dropdown with settings/about/login/logout
- dark mode toggle
- top navigation
- floating AI Insights button
- footer

### Theme behavior

- theme is stored in `localStorage` under `theme`
- `useTheme()` updates the root document theme class
- components like `StockHeatmap` observe theme changes to update chart styles

---

## 5.3 Home Dashboard

### Frontend page

- `src/pages/Home.jsx`

### Visible features

- AI market sentiment card
- US market status card
- active stock count card
- analyst recommendation chart
- sector heatmap
- stocks table
- inline tutorial popups

### Implementation

- market status:
  - frontend calls `GET /stocks/status`
  - backend uses `yf.Market("US").status`
- AI market sentiment:
  - frontend calls `/insights/technology` and `/insights/energy`
  - frontend normalizes classifier output into bullish/bearish/neutral
- analyst recommendations:
  - `AnalystChart.jsx`
  - search box calls `/stocks/search`
  - selected symbol calls `/stocks/recommendations`
  - chart rendered with `react-google-charts`
- heatmap:
  - `StockHeatmap.jsx`
  - calls `/api/heatmap`
  - transforms flat API data into Google TreeMap hierarchical data
- stock list:
  - `StocksTable.jsx`
  - loads popular tickers and favorites

---

## 5.4 Popular Stocks and Favorites

### Frontend component

- `src/components/StocksTable.jsx`

### What it does

- shows default popular stocks
- refreshes quotes every 60 seconds
- supports favorites tab
- supports stock search/autocomplete
- lets authenticated users sync favorites with backend watchlist

### Implementation details

- default symbols are hardcoded in `WATCHLIST_SYMBOLS`
- each symbol fetches quote data from `/stocks/quote/:symbol`
- search calls `/stocks/search`
- favorites for authenticated users come from `/watchlist/`
- add/remove favorite calls:
  - `POST /watchlist/`
  - `DELETE /watchlist/{symbol}`

### Backend support

- `app/routes/stocks.py`
  - quote lookup
  - stock search
- `app/routes/watchlist.py`
  - CRUD for user watchlist rows

### Data model

- `watchlist_items`
  - unique per `user_id + symbol`

---

## 5.5 Portfolio Tracker

### Frontend page

- `src/pages/Portfolio.jsx`

### User-facing features

- portfolio summary cards
- add stock modal
- sell stock modal
- holdings table
- transaction history tab
- invested vs current value chart
- sector allocation radar chart
- symbol autocomplete search

### Main frontend logic

- fetches holdings from `GET /portfolio/`
- fetches history from `GET /portfolio/history`
- add stock:
  - symbol search through `/stocks/search`
  - submit through `POST /portfolio/`
- sell stock:
  - submit through `POST /portfolio/sell`
- delete holding:
  - `DELETE /portfolio/{id}`
- metrics are computed client-side from enriched holding data:
  - total invested
  - current value
  - total return
  - daily profit/loss

### Charts

- `AreaChartPortfolio.jsx`
  - Chart.js line/area visualization
  - builds a cumulative invested timeline and current value timeline
  - colors gap green for profit and red for loss
- `PortfolioRadarChart.jsx`
  - Recharts radar chart
  - groups holdings by sector
  - computes invested percentage allocation

### Backend portfolio behavior

- `app/routes/portfolio.py`
  - `/portfolio/`
    - lists all holdings
    - enriches each holding with live yFinance quote data
  - `/portfolio/history`
    - returns immutable buy/sell activity
    - can seed history from preexisting holdings
  - `POST /portfolio/`
    - adds new holding
    - merges with same-symbol existing holding
    - recalculates weighted average cost
    - logs a buy activity
  - `POST /portfolio/sell`
    - validates available quantity
    - reduces or removes holding
    - logs a sell activity
  - `DELETE /portfolio/{holding_id}`
    - removes a holding owned by current user

### Data models

- `holdings`
  - current open positions
- `portfolio_activities`
  - transaction history with `buy` / `sell`

### Important implementation detail

The backend treats `holdings` as the current state and `portfolio_activities` as the audit/history layer.

---

## 5.6 Market News and Saved Articles

### Frontend page

- `src/pages/News.jsx`

### Features

- latest news tab
- saved articles tab
- bookmark toggle for authenticated users
- login redirect when trying to access saved content unauthenticated

### Implementation

- latest news loads from `GET /stocks/news`
- saved articles load from `GET /stocks/news/saved`
- saving an article sends normalized article metadata to `POST /stocks/news/saved`
- unsaving calls `DELETE /stocks/news/saved/{saved_id}`
- frontend maintains `savedByExternalId` map to quickly resolve whether an article is already saved

### Backend

- `app/routes/stocks.py`
  - latest news comes from Finnhub
  - Reuters articles are filtered out
  - saved article records are persisted per user

### Data model

- `saved_news`
  - unique per `user_id + external_id`

---

## 5.7 Community Discussions

### Frontend screens

- `src/pages/Community.jsx`
- `src/components/Discussion.jsx`
- `src/pages/DiscussionThread.jsx`

### Features

- list discussion threads
- create new discussion
- view thread detail
- create posts in thread
- like/unlike posts
- delete own thread/post
- report thread/post
- contributor leaderboard
- admin manage mode links

### Community list flow

- `Discussion.jsx` loads threads from `GET /discussions/threads`
- creating a thread calls `POST /discussions/threads`
- deleting own thread calls `DELETE /discussions/threads/{id}`
- admins delete through `/admin/threads/{id}`
- reporting a thread calls `POST /discussions/threads/{id}/reports`

### Thread detail flow

- `DiscussionThread.jsx` loads thread from `GET /discussions/threads/{threadId}`
- separately loads per-post like state from `GET /discussions/posts/{postId}/likes`
- posting message calls `POST /discussions/threads/{threadId}/posts`
- liking/unliking calls `POST /discussions/posts/{postId}/likes`
- deleting own post calls `DELETE /discussions/posts/{postId}`
- admins delete posts through `/admin/posts/{postId}`
- reporting a post calls `POST /discussions/posts/{postId}/reports`

### Contributor leaderboard

Implemented entirely on the frontend in `Community.jsx`:

- fetches all threads
- fetches each thread detail
- computes:
  - `25` points per thread
  - `10` points per post
- displays top 3 plus current user contribution

### Backend discussion logic

- `app/routes/discussions.py`
  - thread and post CRUD
  - like toggle
  - report creation
  - thread stats refresh

### Data models

- `threads`
  - category, title, creator, message count, participating user ids
- `posts`
  - thread link, author, content, like count, liked user ids
- `reports`
  - moderation queue for reported threads/posts

### Important implementation detail

The thread model stores denormalized metadata:

- `message_count`
- `participating_users` as JSON

These are refreshed after post deletions and maintained on post creation.

---

## 5.8 Admin Dashboard and Moderation

### Frontend page

- `src/pages/AdminDashboard.jsx`

### Features

- view all users
- ban/unban users
- delete user accounts
- enter community admin-manage mode
- review reported content
- open reported thread/post directly
- delete reports from moderation queue

### Frontend implementation

- users load from `GET /admin/users`
- reports load from `GET /admin/reports`
- ban user:
  - `POST /admin/users/{id}/ban`
- unban user:
  - `DELETE /admin/users/{id}/ban`
- delete user:
  - `DELETE /admin/users/{id}`
- delete report:
  - `DELETE /admin/reports/{id}`
- view report target:
  - navigates into thread page with highlight query params

### Access control

- frontend route is wrapped in `AdminRoute`
- backend enforces admin access with `get_current_admin`

### Backend implementation

- `app/routes/admin.py`
  - fetches local profiles
  - fetches Supabase auth users to obtain `banned_until`
  - uses Supabase admin API for ban/unban/delete
  - supports admin deletion of threads and posts
  - resolves report thread context for frontend deep links

---

## 5.9 AI Insights Sidebar

### Frontend component

- `src/components/AIInsightsSidebar.jsx`

### Features

- market overview of key indices
- sector sentiment analysis
- AI-generated alerts
- tutorial popups for each AI panel

### Implementation

- market overview:
  - loads SPY, QQQ, DIA, `^VIX`
  - each quote fetched via `/stocks/quote/:symbol`
- sector sentiment:
  - calls:
    - `/insights/technology`
    - `/insights/energy`
    - `/insights/healthcare`
    - `/insights/financial`
  - frontend normalizes classifier output into bullish/neutral/bearish and percentage bars
- AI alerts:
  - calls `/insights/alerts/`
  - classifies returned summaries into positive/warning/negative styling

### Backend AI implementation

- `app/routes/insights.py`
  - gets recent sector-related news via yFinance
  - sends combined summaries to Hugging Face financial sentiment model
  - generates AI alerts by summarizing randomly sampled Apple news items

### Important implementation detail

The AI classification/summarization layer is backend-driven, but sentiment labels and visual interpretation are done in the frontend.

---

## 5.10 Tutorials and Educational Content

### Pages/components

- `src/pages/Tips.jsx`
- `src/components/TipsComponent.jsx`
- `src/components/TutorialPopup.jsx`

### Feature types

1. Full learning page
   - static educational tutorials such as DCA, diversification, P/E ratios, technical analysis, risk management, and fundamental analysis
   - recommended influencer list
2. Contextual feature tutorials
   - modal popups attached to charts/tables around the app
   - include steps, tip text, and optional embedded Google Drive video

### Implementation

- `TutorialPopup.jsx`
  - shared modal component
  - merges default tutorials with page-specific tutorials
  - can show/hide video preview
  - locks body scroll while open
- multiple pages/components pass tutorial keys:
  - Home
  - Portfolio
  - AI Insights sidebar

---

## 5.11 About Page

### Frontend page

- `src/pages/About.jsx`

### Purpose

- product overview
- mission statement
- platform feature cards
- tech stack summary
- CTA to register or return to dashboard

This page is informational only and does not depend on backend data.

---

## 6. Backend API Summary by Feature

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PATCH /auth/profile`
- `PATCH /auth/password`
- `DELETE /auth/account`

### Market / Stocks

- `GET /stocks/status`
- `GET /stocks/news`
- `GET /stocks/recommendations`
- `GET /stocks/quote/{symbol}`
- `GET /stocks/search`
- `GET /api/heatmap`

### Saved news

- `GET /stocks/news/saved`
- `POST /stocks/news/saved`
- `DELETE /stocks/news/saved/{id}`

### Watchlist

- `GET /watchlist/`
- `POST /watchlist/`
- `DELETE /watchlist/{symbol}`

### Portfolio

- `GET /portfolio/`
- `GET /portfolio/history`
- `POST /portfolio/`
- `POST /portfolio/sell`
- `DELETE /portfolio/{holding_id}`

### Discussions

- `GET /discussions/threads`
- `POST /discussions/threads`
- `GET /discussions/threads/{id}`
- `PUT /discussions/threads/{id}`
- `DELETE /discussions/threads/{id}`
- `POST /discussions/threads/{id}/posts`
- `GET /discussions/threads/{id}/posts`
- `PUT /discussions/posts/{id}`
- `DELETE /discussions/posts/{id}`
- `GET /discussions/posts/{id}/likes`
- `POST /discussions/posts/{id}/likes`
- `POST /discussions/threads/{id}/reports`
- `POST /discussions/posts/{id}/reports`

### AI insights

- `GET /insights/technology`
- `GET /insights/energy`
- `GET /insights/healthcare`
- `GET /insights/financial`
- `GET /insights/alerts/`

### Admin

- `GET /admin/users`
- `POST /admin/users/{id}/ban`
- `DELETE /admin/users/{id}/ban`
- `DELETE /admin/users/{id}`
- `DELETE /admin/threads/{id}`
- `DELETE /admin/posts/{id}`
- `GET /admin/reports`
- `DELETE /admin/reports/{id}`

---

## 7. Database and Data Relationships

### Main tables

- `profiles`
  - one row per app user
- `holdings`
  - current portfolio positions
- `portfolio_activities`
  - buy/sell history
- `watchlist_items`
  - saved favorite symbols
- `saved_news`
  - bookmarked articles
- `threads`
  - discussion threads
- `posts`
  - thread messages
- `reports`
  - moderation reports

### Key relationships

- one `Profile` can own many:
  - holdings
  - watchlist items
  - saved news records
  - threads
  - posts
  - reports
- one `Thread` has many `Post` rows
- reports target either a thread or a post by `target_type + target_id`

### Denormalized data

- `threads.participating_users` stores a JSON list of user ids
- `posts.liked_user_ids` stores a JSON list of user ids

This reduces extra join tables at the cost of more manual update logic.

---

## 8. Testing and Validation

### Frontend tests

The frontend includes:

- route rendering tests
- auth context tests
- theme hook tests
- API service interceptor tests
- smoke tests for pages/components
- route guard tests

Key files:

- `src/App.test.jsx`
- `src/context/AuthContext.test.jsx`
- `src/hooks/useTheme.test.jsx`
- `src/services/api.test.js`
- `src/components/routeGuards.test.jsx`
- `src/test/smoke/*.test.jsx`

### Backend tests

The backend includes:

- endpoint shape/correctness tests
- authenticated feature flow tests for discussions and portfolio
- database cleanup/integrity test for account deletion
- Locust load-test script

Key files:

- `tests/test_backend.py`
- `tests/test_api_crud.py`
- `tests/locustfile.py`

---

## 9. End-to-End Feature Flows

### Register and use portfolio

1. User registers in frontend.
2. Backend creates Supabase account and local profile.
3. JWT is stored in browser.
4. User opens Portfolio page.
5. Frontend requests `/portfolio/` and `/portfolio/history`.
6. User adds a symbol.
7. Backend creates or merges holding and logs a buy activity.
8. Frontend recalculates totals and updates charts/tables.

### Save a news article

1. Frontend loads latest news from `/stocks/news`.
2. User clicks bookmark.
3. Frontend sends normalized article payload to `/stocks/news/saved`.
4. Backend stores it in `saved_news`.
5. Frontend updates saved state map and shows toast.

### Participate in community

1. User opens Community page.
2. Frontend loads thread list from `/discussions/threads`.
3. User creates a thread or opens a thread detail page.
4. Posts are created via `/discussions/threads/{id}/posts`.
5. Likes are toggled with `/discussions/posts/{id}/likes`.
6. Reports create moderation entries in `reports`.
7. Admin reviews those entries in `/admin/reports`.

### Use AI insights

1. User opens sidebar from floating AI button.
2. Frontend loads quotes, AI sector sentiment, and alerts.
3. Backend fetches external market/news data.
4. Backend sends selected text through Hugging Face inference.
5. Frontend converts outputs into compact cards, bars, and alert blocks.

---

## 10. Architectural Strengths

- clear separation between frontend UI and backend feature routers
- centralized Axios client and centralized auth context
- backend grouped cleanly by feature area
- local relational models cover user-generated and saved app data well
- external market data sources are abstracted behind backend endpoints
- admin and normal-user permissions are enforced both in UI and API

---

## 11. Notable Design Decisions

- app pages like Home, About, Portfolio, News, and Tutorials are publicly routable, but many actions inside them require login
- JWT validation depends on Supabase JWKS rather than local secret decoding only
- several charts use different libraries for different visualization needs:
  - Google Charts for TreeMap and column chart
  - Chart.js for portfolio area comparison
  - Recharts for radar chart
- community leaderboard scoring is computed client-side instead of being exposed as a backend endpoint
- reports are modeled as generic moderation records so both threads and posts can share the same queue

---

## 12. Suggested Mental Model for the Codebase

If you want to understand the app quickly, read it in this order:

1. Frontend bootstrap:
   - `src/main.jsx`
   - `src/App.jsx`
   - `src/context/AuthContext.jsx`
   - `src/services/api.js`
2. Shared shell:
   - `src/components/Layout.jsx`
3. Main feature pages:
   - `Home.jsx`
   - `Portfolio.jsx`
   - `News.jsx`
   - `Community.jsx`
   - `DiscussionThread.jsx`
   - `AdminDashboard.jsx`
4. Backend entry and security:
   - `app/main.py`
   - `app/core/security.py`
   - `app/database.py`
5. Feature routers:
   - `auth.py`
   - `stocks.py`
   - `portfolio.py`
   - `discussions.py`
   - `admin.py`
6. Data models:
   - `user.py`
   - `portfolio.py`
   - `portfolio_activity.py`
   - `discussion.py`
   - `report.py`
   - `watchlist.py`
   - `saved_news.py`

---

## 13. Final Summary

StockVisor is organized as a feature-driven full-stack application:

- React handles page composition, local UI state, charts, tutorials, and authenticated UX.
- FastAPI acts as the integration layer between the UI, the database, Supabase Auth, and external finance/AI services.
- SQLAlchemy models store the app's durable user data such as profiles, holdings, watchlists, saved articles, discussions, posts, and moderation reports.

The app’s core value is that it unifies market monitoring, portfolio management, AI interpretation, news tracking, and community discussion into one workflow instead of splitting those tasks across separate tools.
