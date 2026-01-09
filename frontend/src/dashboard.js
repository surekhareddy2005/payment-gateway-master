const API = "http://localhost:8000";

async function loadStats() {
  const res = await fetch(`${API}/api/v1/payments`, {
    headers: {
      "X-Api-Key": "key_test_abc123",
      "X-Api-Secret": "secret_test_xyz789"
    }
  });

  const payments = await res.json();

  const total = payments.length;
  const success = payments.filter(p => p.status === "success");
  const successRate = total ? Math.round((success.length / total) * 100) : 0;
  const totalAmount = success.reduce((sum, p) => sum + p.amount, 0);

  document.querySelector('[data-test-id="total-transactions"]').textContent = total;
  document.querySelector('[data-test-id="success-rate"]').textContent = `${successRate}%`;
 document.querySelector('[data-test-id="total-amount"]').textContent =
  `${(totalAmount / 100).toFixed(2)}`;

}

loadStats();
