const router = require("express").Router();
const crypto = require("crypto");
const db = require("../config/db");
const auth = require("../middleware/auth");
const processPayment = require("../services/paymentProcessor");
const {
  isValidVPA,
  isValidCardNumber,
  detectCardNetwork,
  isValidExpiry
} = require("../services/validation");

// Generate payment ID
function generatePaymentId() {
  return "pay_" + crypto.randomBytes(8).toString("hex");
}

/**
 * SHARED PAYMENT CREATION LOGIC
 * Used by both private and public payment APIs
 */
async function createPayment(req, res) {
  const { order_id, method, vpa, card } = req.body;

  // Validate order belongs to merchant
  const orderRes = await db.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [order_id, req.merchant.id]
  );

  if (orderRes.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  const order = orderRes.rows[0];

  let fields = {
    vpa: null,
    card_network: null,
    card_last4: null
  };

  // ---- UPI VALIDATION ----
  if (method === "upi") {
    if (!isValidVPA(vpa)) {
      return res.status(400).json({
        error: {
          code: "INVALID_VPA",
          description: "Invalid VPA format"
        }
      });
    }
    fields.vpa = vpa;
  }

  // ---- CARD VALIDATION ----
  if (method === "card") {
    if (!card || !isValidCardNumber(card.number)) {
      return res.status(400).json({
        error: {
          code: "INVALID_CARD",
          description: "Card validation failed"
        }
      });
    }

    if (!isValidExpiry(card.expiry_month, card.expiry_year)) {
      return res.status(400).json({
        error: {
          code: "EXPIRED_CARD",
          description: "Card expiry date invalid"
        }
      });
    }

    fields.card_network = detectCardNetwork(card.number);
    fields.card_last4 = card.number.slice(-4);
  }

  // Generate unique payment ID
  let paymentId;
  let exists = true;

  while (exists) {
    paymentId = generatePaymentId();
    const check = await db.query(
      "SELECT 1 FROM payments WHERE id=$1",
      [paymentId]
    );
    exists = check.rows.length > 0;
  }

  // Create payment with status = processing
  await db.query(
    `INSERT INTO payments
     (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4)
     VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)`,
    [
      paymentId,
      order.id,
      req.merchant.id,
      order.amount,
      order.currency,
      method,
      fields.vpa,
      fields.card_network,
      fields.card_last4
    ]
  );

  // Simulate payment processing
  const success = await processPayment(method);

  if (success) {
    await db.query(
      "UPDATE payments SET status='success', updated_at=NOW() WHERE id=$1",
      [paymentId]
    );
  } else {
    await db.query(
      `UPDATE payments
       SET status='failed',
           error_code='PAYMENT_FAILED',
           error_description='Payment processing failed',
           updated_at=NOW()
       WHERE id=$1`,
      [paymentId]
    );
  }

  // Final response
  return res.status(201).json({
    id: paymentId,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    method,
    vpa: fields.vpa,
    card_network: fields.card_network,
    card_last4: fields.card_last4,
    status: success ? "success" : "failed",
    created_at: new Date().toISOString()
  });
}

/**
 * PRIVATE PAYMENT API (AUTH REQUIRED)
 * POST /api/v1/payments
 */
router.post("/api/v1/payments", auth, async (req, res) => {
  return createPayment(req, res);
});

/**
 * PUBLIC PAYMENT API (NO AUTH)
 * POST /api/v1/payments/public
 */
router.post("/api/v1/payments/public", async (req, res) => {
  const { order_id } = req.body;

  const orderRes = await db.query(
    "SELECT * FROM orders WHERE id=$1",
    [order_id]
  );

  if (orderRes.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  // Inject merchant context
  req.merchant = {
    id: orderRes.rows[0].merchant_id
  };

  return createPayment(req, res);
});

/**
 * GET PAYMENT API
 * GET /api/v1/payments/:payment_id
 */
router.get("/api/v1/payments/:payment_id", auth, async (req, res) => {
  const result = await db.query(
    "SELECT * FROM payments WHERE id=$1 AND merchant_id=$2",
    [req.params.payment_id, req.merchant.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Payment not found"
      }
    });
  }

  res.status(200).json(result.rows[0]);
});
/**
 * GET /api/v1/payments
 * List all payments for dashboard
 */
router.get("/api/v1/payments", auth, async (req, res) => {
  const result = await db.query(
    `SELECT id, order_id, amount, currency, method, status, created_at
     FROM payments
     WHERE merchant_id = $1
     ORDER BY created_at DESC`,
    [req.merchant.id]
  );

  res.status(200).json(result.rows);
});


module.exports = router;
