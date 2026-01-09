/**
 * VPA Validation
 * Pattern: ^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$
 */
function isValidVPA(vpa) {
  if (!vpa || typeof vpa !== "string") return false;
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return regex.test(vpa);
}

/**
 * Luhn Algorithm for Card Validation
 */
function isValidCardNumber(number) {
  if (!number) return false;

  const cleaned = number.replace(/[\s-]/g, "");
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Card Network Detection
 */
function detectCardNetwork(number) {
  const cleaned = number.replace(/[\s-]/g, "");

  if (cleaned.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^(60|65|8[1-9])/.test(cleaned)) return "rupay";

  return "unknown";
}

/**
 * Expiry Date Validation
 */
function isValidExpiry(month, year) {
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) return false;

  let y = parseInt(year, 10);
  if (year.length === 2) y += 2000;

  const now = new Date();
  const expiry = new Date(y, m);

  return expiry >= new Date(now.getFullYear(), now.getMonth());
}

module.exports = {
  isValidVPA,
  isValidCardNumber,
  detectCardNetwork,
  isValidExpiry
};
