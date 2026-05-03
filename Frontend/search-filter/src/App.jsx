import { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";
import SearchBar from "./Components/SearchBar";
import FilterPanel from "./Components/FilterPanel";
import StudentCard from "./Components/StudentCard";
import "./index.css";

const SKILLS = ["All", "React", "Python", "Node.js", "MongoDB",
                "Django", "Vue.js", "Angular", "TypeScript", "Flask", "Express"];

export default function App() {
  // ─── Raw State ──────────────────────────────────────────
  const [search, setSearch]     = useState("");
  const [skill, setSkill]       = useState("All");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);

  // ─── Pagination State ────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(0);
  const [totalCount, setTotalCount]   = useState(0);

  // ─── Result State ────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // ─── Debounced Values ────────────────────────────────────
  const debouncedSearch = useDebounce(search, 400);
  const debouncedSkill  = useDebounce(skill, 400);
  const debouncedMin    = useDebounce(minScore, 400);
  const debouncedMax    = useDebounce(maxScore, 400);

  // ─── Filter change hone pe page 1 pe reset karo ─────────
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedSkill, debouncedMin, debouncedMax]);

  // ─── API Call ────────────────────────────────────────────
  useEffect(() => {
    // ✅ Minimum 3 chars rule — agar kuch likha hai toh 3 se kam pe API mat call karo
    if (debouncedSearch.length > 0 && debouncedSearch.length < 3) {
      setStudents([]);
      setTotalCount(0);
      setTotalPages(0);
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (debouncedSearch)          params.append("search", debouncedSearch);
        if (debouncedSkill !== "All") params.append("skill", debouncedSkill);
        if (debouncedMin > 0)         params.append("minScore", debouncedMin);
        if (debouncedMax < 100)       params.append("maxScore", debouncedMax);
        params.append("page", currentPage);   // current page bhejo
        params.append("limit", 10);           // 10 per page

        const res = await fetch(`http://localhost:5000/api/students?${params}`);
        if (!res.ok) throw new Error("Server error");

        const json = await res.json();
        setStudents(json.data);
        // setCount(json.count);
        setTotalCount(json.count);
        setTotalPages(json.totalPages);
      } catch (err) {
        setError("Could not load results. Is the server running?");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();

  }, [debouncedSearch, debouncedSkill, debouncedMin, debouncedMax, currentPage]);

  // ─── Helper: kya search chhoti hai? ─────────────────────
  const isSearchTooShort = search.length > 0 && search.length < 3;

  const handleReset = () => {
    setSearch("");
    setSkill("All");
    setMinScore(0);
    setMaxScore(100);
    setCurrentPage(1);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 Student Search & Filter</h1>
        <p>Find students by name, skill, or score</p>
      </header>

      <div className="main">
        <SearchBar search={search} setSearch={setSearch} />

        {/* ── Hint jab search chhota ho ── */}
        {isSearchTooShort && (
          <p className="hint">Type at least 3 characters to search...</p>
        )}

        <FilterPanel
          skill={skill}       setSkill={setSkill}
          minScore={minScore} setMinScore={setMinScore}
          maxScore={maxScore} setMaxScore={setMaxScore}
          skills={SKILLS}
          onReset={handleReset}
        />

        <div className="results-header">
          {loading && <span className="loading">Searching...</span>}
          {error   && <span className="error">{error}</span>}
          {!loading && !error && !isSearchTooShort &&  (
            <span>
              {totalCount} student{totalCount !== 1 ? "s" : ""} found
              &nbsp;— Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        <div className="cards-grid">
          {students.length > 0
            ? students.map((s) => <StudentCard key={s.id} student={s} />)
            : !loading && !isSearchTooShort && (
                <div className="no-results">
                  <p>😕 No students found</p>
                  <button onClick={handleReset}>Clear filters</button>
                </div>
              )
          }
        </div>

        {/* ─── Pagination Controls ─── */}
        {totalPages > 1 && (
          <div className="pagination">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ← Prev
            </button>
 
            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            ))}
 
            {/* Next button */}
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
