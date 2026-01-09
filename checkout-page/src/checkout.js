const API_BASE = "http://localhost:8000";

const orderId = new URLSearchParams(window.location.search).get("order_id");

const orderIdEl = document.querySelector('[data-test-id="order-id"]');
const amountEl = document.querySelector('[data-test-id="order-amount"]');

const upiForm = document.querySelector('[data-test-id="upi-form"]');
const cardForm = document.querySelector('[data-test-id="card-form"]');

const processing = document.querySelector('[data-test-id="processing-state"]');
const success = document.querySelector('[data-test-id="success-state"]');
const error = document.querySelector('[data-test-id="error-state"]');

orderIdEl.textContent = orderId;

// Fetch order details
fetch(`${API_BASE}/api/v1/orders/${orderId}/public`)
  .then(res => res.json())
 .then(order => {
  if (!order.amount) {
    alert("Invalid order ID or order not found");
    return;
  }
  amountEl.textContent = `₹${(order.amount / 100).toFixed(2)}`;
});


// Toggle forms
function showUPIForm() {
  upiForm.style.display = "block";
  cardForm.style.display = "none";
}

function showCardForm() {
  cardForm.style.display = "block";
  upiForm.style.display = "none";
}

// Handle UPI payment
upiForm.addEventListener("submit", async e => {
  e.preventDefault();
  const vpa = document.querySelector('[data-test-id="vpa-input"]').value;
  startPayment({ method: "upi", vpa });
});

// Handle card payment
cardForm.addEventListener("submit", async e => {
  e.preventDefault();
  const number = document.querySelector('[data-test-id="card-number-input"]').value;
  const expiry = document.querySelector('[data-test-id="expiry-input"]').value;
  const cvv = document.querySelector('[data-test-id="cvv-input"]').value;
  const name = document.querySelector('[data-test-id="cardholder-name-input"]').value;

  const [month, year] = expiry.split("/");

  startPayment({
    method: "card",
    card: {
      number,
      expiry_month: month,
      expiry_year: year,
      cvv,
      holder_name: name
    }
  });
});

async function startPayment(payload) {
  upiForm.style.display = "none";
  cardForm.style.display = "none";
  processing.style.display = "block";

  const res = await fetch(`${API_BASE}/api/v1/payments/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: orderId,
      ...payload
    })
  });

  const payment = await res.json();
  pollPayment(payment.id);
}

async function pollPayment(paymentId) {
  const interval = setInterval(async () => {
    const res = await fetch(`${API_BASE}/api/v1/payments/${paymentId}`, {
      headers: {
        "X-Api-Key": "key_test_abc123",
        "X-Api-Secret": "secret_test_xyz789"
      }
    });

    const payment = await res.json();

    if (payment.status === "success") {
      clearInterval(interval);
      processing.style.display = "none";
      success.style.display = "block";
      document.querySelector('[data-test-id="payment-id"]').textContent = payment.id;
    }

    if (payment.status === "failed") {
      clearInterval(interval);
      processing.style.display = "none";
      error.style.display = "block";
    }
  }, 2000);
}
