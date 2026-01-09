const router = require("express").Router();
const db = require("../config/db");

router.get("/health", async (req, res) => {
  let dbStatus = "connected";

  try {
    await db.query("SELECT 1");
  } catch {
    dbStatus = "disconnected";
  }

  res.status(200).json({
    status: "healthy",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
