export default function FilterPanel({
  skill, setSkill, minScore, setMinScore, maxScore, setMaxScore, skills
}) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Skill</label>
        <select value={skill} onChange={(e) => setSkill(e.target.value)}>
          {skills.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min Score: <strong>{minScore}</strong></label>
        <input
          type="range" min="0" max="100"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>Max Score: <strong>{maxScore}</strong></label>
        <input
          type="range" min="0" max="100"
          value={maxScore}
          onChange={(e) => setMaxScore(Number(e.target.value))}
        />
      </div>

      <button className="reset-btn" onClick={() => {
        setSkill("All");
        setMinScore(0);
        setMaxScore(100);
      }}>
        Reset Filters
      </button>
    </div>
  );
}