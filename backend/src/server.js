const app = require("./app");
const { port } = require("./config/env");
const pool = require("./config/db");

app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({
      message: "Backend is running!",
      dbTest: rows[0].result === 2 ? "Database connected" : "DB test failed",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database connection failed", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
