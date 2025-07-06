document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expense-form");
  const body = document.getElementById("expense-body");
  const totalDisplay = document.getElementById("total-amount");
  const dateInput = document.getElementById("date");

  function getToday() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  function formatDateToUK(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  dateInput.value = getToday();

  let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

  function updateUI() {
    body.innerHTML = "";
    let total = 0;
    expenses.forEach((e, i) => {
      total += parseFloat(e.amount);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${e.description}</td>
        <td>₹${parseFloat(e.amount).toFixed(2)}</td>
        <td>${e.category}</td>
        <td>${formatDateToUK(e.date)}</td>
        <td><button data-index="${i}" class="delete">Delete</button></td>
      `;
      body.appendChild(row);
    });
    totalDisplay.textContent = total.toFixed(2);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const description = document.getElementById("description").value.trim();
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!description || !amount || !category || !date) return;

    expenses.push({ description, amount, category, date });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateUI();
    form.reset();
    dateInput.value = getToday();
  });

  body.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
      const idx = +e.target.dataset.index;
      expenses.splice(idx, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      updateUI();
    }
  });

  updateUI();
});
