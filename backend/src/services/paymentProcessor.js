/**
 * Simulates payment processing with delay and success/failure
 * Supports TEST_MODE for deterministic evaluation
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function processPayment(method) {
  const testMode = process.env.TEST_MODE === "true";

  // ---- TEST MODE (FOR EVALUATION) ----
  if (testMode) {
    const delay = Number(process.env.TEST_PROCESSING_DELAY || 1000);
    await sleep(delay);

    // Default success = true
    if (process.env.TEST_PAYMENT_SUCCESS === "false") {
      return false;
    }
    return true;
  }

  // ---- PRODUCTION SIMULATION ----
  const minDelay = Number(process.env.PROCESSING_DELAY_MIN || 5000);
  const maxDelay = Number(process.env.PROCESSING_DELAY_MAX || 10000);

  const delay =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  await sleep(delay);

  // Success rates
  if (method === "upi") {
    return Math.random() < 0.9; // 90% success
  }

  if (method === "card") {
    return Math.random() < 0.95; // 95% success
  }

  return false;
};
