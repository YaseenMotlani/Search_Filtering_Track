const express = require("express");
const cors = require("cors");
const students = require("./data");

const app = express();
app.use(cors());
app.use(express.json());

// GET 
app.get("/api/students", (req, res) => {
  const { search, skill, minScore, maxScore } = req.query;

  let results = [...students];

  // Filter by name search
  if (search) {
    results = results.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by skill
  if (skill && skill !== "All") {
    results = results.filter((s) => s.skills.includes(skill));
  }

  // Filter by min score
  if (minScore) {
    results = results.filter((s) => s.score >= parseInt(minScore));
  }

  // Filter by max score
  if (maxScore) {
    results = results.filter((s) => s.score <= parseInt(maxScore));
  }

  res.json({ count: results.length, data: results });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));