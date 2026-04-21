# Search_-_Filtering_Track
“Search &amp; Filter system with debounced input, multi-filter logic, and optimized performance for fast and smooth user experience.”

## What I Built
A full-stack search and filtering system for a student dataset.
Users can filter by name, skill, and score range — with results
updating efficiently without unnecessary API calls.

**Tech Stack:** React (frontend) · Node.js + Express (backend) · JSON data

---

## How It Works

### Frontend
- **App.jsx** is the single source of truth — holds all filter state
- **useDebounce** hook delays API calls by 400ms after user stops typing
- **useEffect** watches debounced values — only fires when they change
- **SearchBar, FilterPanel, StudentCard** are pure presentational components

### Backend
- Express server exposes `GET /api/students`
- Accepts query params: `search`, `skill`, `minScore`, `maxScore`
- Filters in-memory JSON array and returns matching results

### Debouncing — why it matters
Without debounce: typing "React" = 5 API calls (R, Re, Rea, Reac, React)  
With debounce: typing "React" = 1 API call (after user stops)

---

## How to Run Locally

### Backend
cd backend
npm install
npm run dev
Server runs on: http://localhost:5000

### Frontend
cd frontend
npm install
npm run dev
App runs on: http://localhost:5173

---

## Project Structure
search-filter-system/
├── backend/
│   ├── server.js        # Express API with filtering logic
│   ├── data.js          # Sample student dataset (15 students)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root — state, API call, layout
│   │   ├── hooks/
│   │   │   └── useDebounce.js   # Custom hook — delays API calls
│   │   ├── components/
│   │   │   ├── SearchBar.jsx    # Text search input
│   │   │   ├── FilterPanel.jsx  # Skill + score filters
│   │   │   └── StudentCard.jsx  # Student display card
│   │   └── index.css            # All styles
│   └── package.json
└── README.md

---

## What I Learned
- How debouncing works and why it prevents unnecessary API calls
- How React state flows from parent to child via props
- How to build dynamic query strings for API filtering
- Clean component separation — each component has one job
- Proper error handling and loading states in async fetch calls
- Git commit discipline — one commit per feature