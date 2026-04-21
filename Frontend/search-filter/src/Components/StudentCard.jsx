export default function StudentCard({ student }) {
  const scoreColor =
    student.score >= 85 ? "#22c55e" :
    student.score >= 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="card">
      <div className="card-header">
        <div className="avatar">{student.name.charAt(0)}</div>
        <div>
          <h3>{student.name}</h3>
          <span className="city">📍 {student.city}</span>
        </div>
        <div className="score" style={{ backgroundColor: scoreColor }}>
          {student.score}
        </div>
      </div>
      <div className="skills">
        {student.skills.map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  );
}