const router = require("express").Router();
const crypto = require("crypto");
const db = require("../config/db");
const auth = require("../middleware/auth");

// Generate order ID
function generateOrderId() {
  return "order_" + crypto.randomBytes(8).toString("hex");
}

/**
 * GET /api/v1/orders/:order_id/public
 * Public order fetch for checkout page
 */
router.get("/api/v1/orders/:order_id/public", async (req, res) => {
  const { order_id } = req.params;

  const result = await db.query(
    "SELECT id, amount, currency, status FROM orders WHERE id=$1",
    [order_id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  res.status(200).json(result.rows[0]);
});

/**
 * POST /api/v1/orders
 */
router.post("/api/v1/orders", auth, async (req, res) => {
  const { amount, currency = "INR", receipt, notes } = req.body;

  // Validation
  if (!amount || !Number.isInteger(amount) || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "amount must be at least 100"
      }
    });
  }

  let orderId;
  let exists = true;

  // Ensure unique order ID
  while (exists) {
    orderId = generateOrderId();
    const check = await db.query(
      "SELECT 1 FROM orders WHERE id=$1",
      [orderId]
    );
    exists = check.rows.length > 0;
  }

  await db.query(
    `INSERT INTO orders
     (id, merchant_id, amount, currency, receipt, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,'created')`,
    [
      orderId,
      req.merchant.id,
      amount,
      currency,
      receipt || null,
      notes || null
    ]
  );

  res.status(201).json({
    id: orderId,
    merchant_id: req.merchant.id,
    amount,
    currency,
    receipt,
    notes,
    status: "created",
    created_at: new Date().toISOString()
  });
});

/**
 * GET /api/v1/orders/:order_id
 */
router.get("/api/v1/orders/:order_id", auth, async (req, res) => {
  const { order_id } = req.params;

  const result = await db.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [order_id, req.merchant.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  res.status(200).json(result.rows[0]);
});


module.exports = router;
