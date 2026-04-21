import { useState, useEffect } from "react";
import useDebounce from "./hooks/useDebounce";
import SearchBar from "./Components/SearchBar";
import FilterPanel from "./Components/FilterPanel";
import StudentCard from "./Components/StudentCard";
import "./index.css";

const SKILLS = ["All", "React", "Python", "Node.js", "MongoDB", "Django", "Vue.js", "Angular", "TypeScript", "Flask", "Express"];

export default function App() {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Debounced values — API only calls after user stops typing
  const debouncedSearch = useDebounce(search, 400);
  const debouncedMin = useDebounce(minScore, 400);
  const debouncedMax = useDebounce(maxScore, 400);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (skill !== "All") params.append("skill", skill);
        if (debouncedMin > 0) params.append("minScore", debouncedMin);
        if (debouncedMax < 100) params.append("maxScore", debouncedMax);

        const res = await fetch(`http://localhost:5000/api/students?${params}`);
        const json = await res.json();
        setStudents(json.data);
        setCount(json.count);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [debouncedSearch, skill, debouncedMin, debouncedMax]);

  return (
    <div className="app">
      <header className="header">
        <h1>🔍 Student Search & Filter</h1>
        <p>Find students by name, skill, or score</p>
      </header>

      <div className="main">
        <SearchBar search={search} setSearch={setSearch} />
        <FilterPanel
          skill={skill} setSkill={setSkill}
          minScore={minScore} setMinScore={setMinScore}
          maxScore={maxScore} setMaxScore={setMaxScore}
          skills={SKILLS}
        />

        <div className="results-header">
          {loading ? (
            <span className="loading">Searching...</span>
          ) : (
            <span>{count} student{count !== 1 ? "s" : ""} found</span>
          )}
        </div>

        <div className="cards-grid">
          {students.length > 0 ? (
            students.map((s) => <StudentCard key={s.id} student={s} />)
          ) : (
            !loading && <p className="no-results">😕 No students found</p>
          )}
        </div>
      </div>
    </div>
  );
}