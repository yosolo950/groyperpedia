const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "No query provided" });

  try {
    const result = await pool.query(
      "SELECT title, subtitle, entry_content FROM entry WHERE LOWER(title) = LOWER($1) LIMIT 1",
      [query]
    );

    if (result.rows.length === 0) {
      return res.json({ found: false });
    }

    const row = result.rows[0];
    res.json({
      found: true,
      title: row.title,
      subtitle: row.subtitle,
      content: row.entry_content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
