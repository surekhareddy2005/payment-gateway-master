const router = require("express").Router();
const db = require("../config/db");

router.get("/api/v1/test/merchant", async (req, res) => {
  const result = await db.query(
    "SELECT id, email, api_key FROM merchants WHERE email='test@example.com'"
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({
    id: result.rows[0].id,
    email: result.rows[0].email,
    api_key: result.rows[0].api_key,
    seeded: true
  });
});

module.exports = router;
