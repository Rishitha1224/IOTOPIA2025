const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("data.db");
db.run(`CREATE TABLE IF NOT EXISTS logs(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device TEXT,
  status TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post("/api/data", (req, res) => {
  const { device, status } = req.body;
  db.run("INSERT INTO logs(device,status) VALUES(?,?)", [device, status]);
  res.json({ ok: true });
});

app.get("/api/data", (req, res) => {
  db.all("SELECT * FROM logs ORDER BY id DESC LIMIT 20", (err, rows) => {
    res.json(rows);
  });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));