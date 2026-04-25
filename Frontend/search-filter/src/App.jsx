import { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";
import SearchBar from "./Components/SearchBar";
import FilterPanel from "./Components/FilterPanel";
import StudentCard from "./Components/StudentCard";
import "./index.css";

const SKILLS = ["All", "React", "Python", "Node.js", "MongoDB", 
                "Django", "Vue.js", "Angular", "TypeScript", "Flask", "Express"];

export default function App() {
  // ─── Raw State (user ke actions se update hote hain) ───
  const [search, setSearch]     = useState("");
  const [skill, setSkill]       = useState("All");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);

  // ─── Result State ───────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [count, setCount]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // ─── Debounced Values ───────────────────────────────────
  // API sirf inhe watch karegi — raw state ko nahi
  const debouncedSearch = useDebounce(search, 400);
  const debouncedSkill  = useDebounce(skill, 400);   // ✅ SKILL PE BHI DEBOUNCE
  const debouncedMin    = useDebounce(minScore, 400);
  const debouncedMax    = useDebounce(maxScore, 400);

  // ─── API Call ───────────────────────────────────────────
  // Sirf tab chalega jab debounced values change hongi
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (debouncedSearch)          params.append("search", debouncedSearch);
        if (debouncedSkill !== "All") params.append("skill", debouncedSkill);
        if (debouncedMin > 0)         params.append("minScore", debouncedMin);
        if (debouncedMax < 100)       params.append("maxScore", debouncedMax);

        const res = await fetch(`http://localhost:5000/api/students?${params}`);
        if (!res.ok) throw new Error("Server error");

        const json = await res.json();
        setStudents(json.data);
        setCount(json.count);
      } catch (err) {
        setError("Could not load results. Is the server running?");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();

  }, [debouncedSearch, debouncedSkill, debouncedMin, debouncedMax]);
  //  ↑ ONLY debounced values here — raw state nahi

  const handleReset = () => {
    setSearch("");
    setSkill("All");
    setMinScore(0);
    setMaxScore(100);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 Student Search & Filter</h1>
        <p>Find students by name, skill, or score</p>
      </header>

      <div className="main">
        <SearchBar search={search} setSearch={setSearch} />

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
          {!loading && !error && (
            <span>{count} student{count !== 1 ? "s" : ""} found</span>
          )}
        </div>

        <div className="cards-grid">
          {students.length > 0
            ? students.map((s) => <StudentCard key={s.id} student={s} />)
            : !loading && (
                <div className="no-results">
                  <p>😕 No students found</p>
                  <button onClick={handleReset}>Clear filters</button>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}