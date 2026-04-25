export default function FilterPanel({
  skill, setSkill,
  minScore, setMinScore,
  maxScore, setMaxScore,
  skills,
  onReset  //  App.jsx se aata hai
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
          type="range"
          min="0"
          max={maxScore}   // min slider maxScore se aage nahi ja sakta
          step="1"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>Max Score: <strong>{maxScore}</strong></label>
        <input
          type="range"
          min={minScore}   // max slider minScore se peeche nahi ja sakta
          max="100"
          step="1"
          value={maxScore}
          onChange={(e) => setMaxScore(Number(e.target.value))}
        />
      </div>

      {/* onReset directly App.jsx ka handleReset call karta hai */}
      <button className="reset-btn" onClick={onReset}>
        Reset Filters
      </button>

    </div>
  );
}