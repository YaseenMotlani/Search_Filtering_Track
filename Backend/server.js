const express = require("express");
const cors = require("cors");
const students = require("./data");

const app = express();
app.use(cors());
app.use(express.json());

// ─── Full Text Search Helper ────────────────────────────────────────────────
// Ye function har student ko ek "relevance score" deta hai
// Jitna zyada score, utna better match
function fullTextSearch(students, query) {
  if (!query || query.trim() === "") return students.map(s => ({ ...s, _relevance: 1 }));

  const terms = query.toLowerCase().trim().split(/\s+/); // query ko words mein todta hai

  const results = [];

  for (const student of students) {
    let relevance = 0;
    const nameLower = student.name.toLowerCase();
    const cityLower = student.city.toLowerCase();
    const skillsLower = student.skills.map(sk => sk.toLowerCase());

    for (const term of terms) {
      // ── Exact full name match → highest priority
      if (nameLower === term) relevance += 100;

      // ── Name starts with term → high priority
      else if (nameLower.startsWith(term)) relevance += 80;

      // ── Any word in name starts with term (e.g "ali" matches "Ali Khan")
      else if (nameLower.split(" ").some(word => word.startsWith(term))) relevance += 60;

      // ── Name contains term anywhere
      else if (nameLower.includes(term)) relevance += 40;

      // ── City match
      if (cityLower.includes(term)) relevance += 20;

      // ── Skill match
      if (skillsLower.some(sk => sk.includes(term))) relevance += 30;
    }

    // Sirf woh students include karo jinka relevance > 0 hai
    if (relevance > 0) {
      results.push({ ...student, _relevance: relevance });
    }
  }

  // Best match pehle aaye
  return results.sort((a, b) => b._relevance - a._relevance);
}

// ─── GET /api/students ──────────────────────────────────────────────────────
app.get("/api/students", (req, res) => {
  const { search, skill, minScore, maxScore, page = "1", limit = "10" } = req.query;

  // ── Minimum 3 chars rule (agar search hai toh)
  if (search && search.trim().length < 3) {
    return res.json({ count: 0, data: [], message: "Type at least 3 characters" });
  }

  let results = [...students];

  // ── Step 1: Full Text Search
  if (search && search.trim().length >= 3) {
    results = fullTextSearch(results, search.trim());
  }

  // ── Step 2: Skill filter
  if (skill && skill !== "All") {
    results = results.filter((s) => s.skills.includes(skill));
  }

  // ── Step 3: Score range filter
  if (minScore) results = results.filter((s) => s.score >= parseInt(minScore));
  if (maxScore) results = results.filter((s) => s.score <= parseInt(maxScore));

  // ── Remove internal _relevance field before sending
  const cleaned = results.map(({ _relevance, ...rest }) => rest);

 // Step 4: Pagination
  const totalCount = cleaned.length;
  const pageNum    = parseInt(page);
  const limitNum   = parseInt(limit);
  const totalPages = Math.ceil(totalCount / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated  = cleaned.slice(startIndex, startIndex + limitNum);
 
  res.json({
    count:       totalCount,
    totalPages,
    currentPage: pageNum,
    data:        paginated
  });
});
 
app.listen(5000, () => console.log("Server running on http://localhost:5000"));