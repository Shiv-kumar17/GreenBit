const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = "scans.json";

/* ---------- SAVE SCAN ---------- */

app.post("/api/scan", (req, res) => {

  const scan = req.body;

  let data = [];

  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  data.push(scan);

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ status: "saved" });
});

/* ---------- GET GLOBAL STATS ---------- */

app.get("/api/stats", (req, res) => {

  if (!fs.existsSync(DATA_FILE)) {
    return res.json({ scans: 0, carbon: 0, energy: 0 });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));

  let carbon = 0;
  let energy = 0;

  data.forEach(s => {
    carbon += Number(s.carbon);
    energy += Number(s.energy);
  });

  res.json({
    scans: data.length,
    carbon,
    energy
  });
});

/* ---------- START ---------- */

app.listen(5000, () => {
  console.log("GreenBit backend running on port 5000");
});
