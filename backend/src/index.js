const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./config/db");
const seedTestMerchant = require("./services/seedMerchant");

const healthRoute = require("./routes/health");
const testRoute = require("./routes/test");
const ordersRoute = require("./routes/orders");
const paymentsRoute = require("./routes/payments");
  const cors = require("cors");

const app = express();
app.use(cors()); 

app.use(express.json());
app.use(cors()); 
// 🔹 ROUTES
app.use(ordersRoute);
app.use(testRoute);
app.use(healthRoute);
app.use(paymentsRoute);

// 🔹 DB INIT
async function initDB() {
  const schema = fs.readFileSync(
    path.join(__dirname, "db/schema.sql"),
    "utf8"
  );
  await db.query(schema);
  await seedTestMerchant();
}

initDB().catch(err => {
  console.error("DB INIT FAILED", err);
  process.exit(1);
});

// 🔹 ROOT
app.get("/", (req, res) => {
  res.send("Payment Gateway API Running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
