export default function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search by student name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button className="clear-btn" onClick={() => setSearch("")}>✕</button>
      )}
    </div>
  );
}