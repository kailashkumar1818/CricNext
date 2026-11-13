# 🏏 Cricnext
(MERN Stack)

A full-stack cricket web application modeled after Cricbuzz, built with MongoDB, Express, React, Node.js, and Tailwind CSS.

---

## 🌟 Key Features

1. **Home Page**:
   - Featured live match hero card with live score equation and on-crease batsmen
   - Top cricket stories with categories, authors, and read times
   - Recent results slider
   - Upcoming matches summary
   - ICC Test rankings preview widget

2. **Live Match Center (`/live-score/:id`)**:
   - Live scores, run rate (CRR), and required run rate (RRR)
   - Batters on crease with on-strike indicator, 4s, 6s, and strike rate
   - Active bowler figures (overs, maidens, runs, wickets, economy)
   - Recent overs sequence (dots, 1s, boundaries, wickets)
   - Ball-by-ball commentary stream
   - **Auto-refreshes every 10 seconds** with visible countdown timer & manual refresh

3. **Detailed Scorecard (`/scorecard/:id`)**:
   - Multi-innings tab switcher
   - Complete batting scorecard (dismissals, runs, balls, 4s, 6s, SR)
   - Extras line & innings totals
   - Complete bowling scorecard (overs, maidens, runs, wickets, economy)

4. **Schedule & Upcoming Fixtures (`/schedule`)**:
   - Filter by national team (India, Australia, England, South Africa, etc.)
   - Filter by series name
   - Match format badge, date, time in GMT / IST, and venue

5. **News & Editorial Section (`/news` & `/news/:slugOrId`)**:
   - Category filtering (Match Report, International, IPL / League, Editorial)
   - Keyword search across news articles
   - Full article view with lead quotes, markdown paragraphs, tags, and related news

6. **Teams & Player Profiles (`/teams` & `/players/:id`)**:
   - National teams directory with ICC rankings and trophy cabinet
   - Squad roster listings
   - Individual player career cards with format tabs (Test, ODI, T20I) for batting & bowling

7. **ICC World Rankings (`/rankings`)**:
   - Formats: Test, ODI, T20
   - Categories: Team Standings, Batting Rankings, Bowling Rankings

8. **Global Search Bar (Ctrl+K / ⌘K)**:
   - Instant search modal across teams, players, and news stories with keyboard shortcut

9. **Admin Editorial Dashboard (`/admin/dashboard`)**:
   - JWT authentication (`/admin/login`)
   - Add new articles with categories, tags, images, and homepage spotlight toggle
   - Edit existing articles
   - Delete articles with instant feedback

---

## 🔑 Default Admin Credentials

- **Email:** `admin@cricbuzz.com`
- **Password:** `admin123`

---

## 🚀 Running Locally

### Step 1: Start MongoDB
Ensure MongoDB is running locally on port `27017` (or set `MONGO_URI` in `backend/.env`).

### Step 2: Seed the Database
Populates the admin user, teams, players, and news articles:
```bash
cd backend
npm run seed
```

### Step 3: Run the Backend
```bash
cd backend
npm run dev
```
Backend runs at `http://localhost:5000`.

### Step 4: Run the Frontend
In a separate terminal window:
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:3000`.
