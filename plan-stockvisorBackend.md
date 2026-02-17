# Plan: FastAPI Backend with PostgreSQL for Stockvisor MVP

**TL;DR:** Create a separate `stockvisor-backend` folder alongside your frontend with FastAPI, PostgreSQL, and SQLAlchemy. Implement authentication (JWT), portfolio management, and mock stock data endpoints for the MVP. The frontend will switch from hardcoded data to API calls via Axios. Separate database from code, use environment variables for config.

## Steps

1. **Create backend project structure** alongside the frontend folder (`c:\Users\ranwa\Desktop\Uni\FINAL\Ryan Anwar 228939 GP\stockvisor-backend`)
   - Directory layout: app/models/, app/routes/, app/schemas/, app/core/, app/database/, tests/
   - `main.py` as entry point with FastAPI app initialization
   - `requirements.txt` with FastAPI, SQLAlchemy, psycopg2, pydantic, python-jose[cryptography], python-multipart, python-dotenv

2. **Set up PostgreSQL & database layer**
   - Create `app/database.py` with SQLAlchemy engine, session management, and base model class
   - Create `app/models/` with SQLAlchemy ORM models: User, Portfolio, Stock, Watchlist, Transaction
   - Use `.env` file for DATABASE_URL and other config (never hardcode credentials)

3. **Implement authentication system**
   - Create `app/core/security.py` with password hashing (bcrypt), JWT token generation
   - Create `app/core/config.py` for SECRET_KEY and JWT settings
   - Create `app/schemas/auth.py` with Pydantic models (UserCreate, UserLogin, Token)
   - Create `app/routes/auth.py` with POST /auth/register and POST /auth/login endpoints
   - Use dependency injection for `get_current_user()` to protect routes

4. **Implement portfolio endpoints (MVP core)**
   - Create `app/models/portfolio.py` with holdings, transactions, cost basis tracking
   - Create `app/schemas/portfolio.py` with Pydantic models (PortfolioItem, Transaction)
   - Create `app/routes/portfolio.py` with:
     - GET /portfolio/{user_id} - get user's holdings
     - POST /portfolio - add new stock to portfolio
     - DELETE /portfolio/{stock_id} - remove stock
     - POST /transactions - record buy/sell transactions

5. **Implement mock stock data endpoint**
   - Create `app/routes/stocks.py` with:
     - GET /stocks/quote/{symbol} - return hardcoded price data 
     - GET /stocks/search - search functionality
     - GET /watchlist/{user_id} - user's watchlist
   - Use mock data structure with real AAPL, MSFT, GOOGL, TSLA prices (structure ready for real API integration later)

6. **Set up CORS for frontend integration**
   - Add CORSMiddleware in `main.py` to allow requests from `http://localhost:5173` (Vite dev server)

7. **Create API documentation file**
   - Generate or document endpoint specs so frontend knows what to expect
   - Reference in each route file

8. **Update frontend for API integration** (later step you'll execute)
   - Create `src/services/api.js` with Axios instance pointing to `http://localhost:8000`
   - Create `src/hooks/useAuth.js`, `usePortfolio.js`, `useStocks.js` for data fetching
   - Replace hardcoded data in components with API calls

## Verification

- Run FastAPI server: `uvicorn app.main:app --reload` (port 8000)
- Test auth flow: POST to `/auth/register`, then `/auth/login`, verify JWT token returned
- Test portfolio endpoint: GET `/portfolio/{user_id}` returns user holdings (requires auth token)
- Test stocks endpoint: GET `/stocks/quote/AAPL` returns mock price data
- Verify CORS works: Frontend on port 5173 can call backend on 8000 without errors
- (Optional) Use FastAPI's built-in Swagger docs at `http://localhost:8000/docs`

## Decisions

- PostgreSQL chosen for relational data (users, portfolios, transactions)
- JWT for stateless authentication (scalable, easier than sessions)
- Mock stock data initially to focus on backend structure—real API integration is straightforward later
- Separate `stockvisor-backend` folder keeps projects cleanly isolated; can be version-controlled separately

## Frontend Analysis

### Technical Stack
- React 19.2.0 with React Router DOM 7.13.0 for client-side routing
- Vite as build tool (modern, fast bundler)
- Tailwind CSS for styling
- Axios 1.13.5 for HTTP requests (installed but not currently used)
- Chart.js for data visualization
- React Icons for UI components

### Pages & Current Data Status

| Page | Current State | Backend Needs |
|------|---------------|----------------|
| **Home** | Dashboard with hardcoded watchlist (AAPL, MSFT, GOOGL, TSLA) | Real-time stock prices, user watchlist management |
| **Portfolio** | Hardcoded holdings with manual calculations (total value, gains) | User portfolio storage, transaction history, live price updates |
| **Community** | Hardcoded discussion posts and top contributors | Discussion threads API, user reputation system, comment storage |
| **News** | Hardcoded market news articles | News feed API, category filtering, article management |
| **Tips** | Hardcoded educational content about trading | Could be static frontend content or backend-managed CMS |
| **About** | Static informational page | No backend needed |

### Existing API Integration Patterns
- None yet - Axios is installed but not utilized anywhere
- No environment variables configured
- No API service layer or custom hooks set up
- All data is hardcoded directly in components

### Critical Backend Features Needed

1. **User Authentication & Management**
   - Login/registration system
   - User profiles and preferences
   - Session management

2. **Portfolio Management**
   - Store user stock holdings
   - Track purchase/cost basis data
   - Calculate gains/losses automatically
   - Update based on current market prices

3. **Stock Data Service**
   - Real-time or cached stock prices
   - Stock search/lookup functionality
   - Watchlist CRUD operations
   - 24h price change data

4. **Community System**
   - Discussion threads CRUD
   - Comments/replies system
   - User reputation/points tracking
   - Top contributors ranking

5. **Market News** 
   - Aggregate or fetch news articles
   - Category-based filtering (Market News, Earnings, Commodities, Crypto)
   - Article metadata (source, date, impact level)

### Architecture Notes
- Routing is handled client-side via React Router (no page-based backend routing needed)
- Components directory is empty (no reusable components created yet)
- Hooks directory is empty (no custom React hooks for data fetching)
- No CORS or proxy configuration visible
- Site uses gradient dark theme (slate-900 base with blue accents)