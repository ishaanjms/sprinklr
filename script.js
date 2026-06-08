const rows = [
  { title: "ACME Airways - Book Flight", statusType: "progress", statusLabel: "In progress", scenario: "ACME Airways_Flight Booking", count: 16, canStop: true },
  { title: "ACME Airways - Manage Booking", statusType: "progress", statusLabel: "In progress", scenario: "ACME Airways_Flight Booking", count: 16, canStop: true },
  { title: "ACME Airways - Check Flight Status", statusType: "failed", statusLabel: "Failed", scenario: "ACME Airways_Flight Booking", count: 16, canStop: false },
  { title: "ACME Airways - Customer Support", statusType: "failed", statusLabel: "Failed", scenario: "ACME Airways_Flight Booking", count: 16, canStop: false },
  { title: "ACME Airways - Flight Deals", statusType: "failed", statusLabel: "Failed", scenario: "ACME Airways_Flight Booking", count: 16, canStop: false },
  { title: "ACME Airways - Loyalty Program", statusType: "failed", statusLabel: "Failed", scenario: "ACME Airways_Flight Booking", count: 16, canStop: false },
  { title: "ACME Airways - Corporate Travel", statusType: "failed", statusLabel: "Failed", scenario: "ACME Airways_Flight Booking_...", count: 22, canStop: false },
  { title: "ACME Airways - Travel Insurance", statusType: "completed", statusLabel: "Completed", scenario: "ACME Airways_Flight Booking", count: 16, canStop: false },
  { title: "ACME Airways - Special Services", statusType: "completed", statusLabel: "Completed", scenario: "ACME Airways_Flight Booking_...", count: 27, canStop: false },
  { title: "ACME Airways - Feedback", statusType: "completed", statusLabel: "Completed", scenario: "ACME Airways_Flight Booking_...", count: 41, canStop: false },
];

const variantOrder = ["thinking", "chat", "wave", "skeleton", "dots", "muted", "blue"];
const variants = new Set(variantOrder);
const state = {
  variant: readVariant(),
  restartToken: 0,
};

function readVariant() {
  const fromHash = window.location.hash.replace("#", "");
  return variants.has(fromHash) ? fromHash : "thinking";
}

function writeVariant(nextVariant, fromUser = false) {
  state.variant = nextVariant;
  if (window.location.hash.replace("#", "") !== nextVariant) {
    window.history.replaceState(null, "", `#${nextVariant}`);
  }
  syncVariantPicker();
  renderRows();
}

function nextVariant() {
  const index = variantOrder.indexOf(state.variant);
  return variantOrder[(index + 1) % variantOrder.length];
}

function successMarkup(variant, index) {
  const delay = `${index * 90}ms`;

  if (variant === "thinking") {
    return `
      <span class="thinking-loader" style="--row-delay: ${delay}" aria-label="Calculating">
        <i></i><i></i><i></i><i></i>
      </span>
    `;
  }

  if (variant === "chat") {
    return `
      <span class="chat-loader" style="--row-delay: ${delay}" aria-label="Preparing answer">
        <i class="chat-dot chat-orange"></i>
        <i class="chat-dot chat-cyan"></i>
        <i class="chat-dot chat-green"></i>
        <i class="chat-dot chat-blue"></i>
      </span>
    `;
  }

  if (variant === "wave") {
    return `
      <span class="wave-loader" style="--row-delay: ${delay}" aria-label="Calculating">
        <i></i><i></i><i></i><i></i>
      </span>
    `;
  }

  if (variant === "skeleton") {
    return `<span class="success-skeleton" style="--row-delay: ${delay}"></span>`;
  }

  if (variant === "muted" || variant === "blue") {
    const colorClass = variant === "blue" ? " blue" : "";
    return `
      <span class="calculating${colorClass}" style="--row-delay: ${delay}">
        <svg><use href="#icon-spinner"></use></svg>
        <span>Calculating</span>
      </span>
    `;
  }

  return `
    <span class="success-dots" style="--row-delay: ${delay}">
      <i></i><i></i><i></i><i></i>
    </span>
  `;
}

function renderRows() {
  const tbody = document.getElementById("simulationRows");

  tbody.innerHTML = rows
    .map((row, index) => {
      const action = row.canStop ? '<button class="stop-button" type="button">Stop Simulation</button>' : "";
      return `
        <tr style="--row-index: ${index}">
          <td class="index">${index + 1}</td>
          <td class="menu"><svg><use href="#icon-kebab"></use></svg></td>
          <td class="name">
            <div class="name-wrap">
              <svg class="open-icon"><use href="#icon-open"></use></svg>
              <span class="simulation-title">${row.title}</span>
              ${action}
            </div>
          </td>
          <td><span class="badge ${row.statusType}">${row.statusLabel}</span></td>
          <td class="success-cell">${successMarkup(state.variant, index)}</td>
          <td class="scenario">${row.scenario}</td>
          <td class="count">${row.count}</td>
        </tr>
      `;
    })
    .join("");
}

function restartLoadingMotion() {
  const app = document.querySelector(".app-frame");
  state.restartToken += 1;
  app.dataset.restartToken = state.restartToken;
  app.classList.remove("is-restarting");
  requestAnimationFrame(() => {
    app.classList.add("is-restarting");
    window.setTimeout(() => app.classList.remove("is-restarting"), 920);
  });
  renderRows();
}

function syncVariantPicker() {
  document.querySelectorAll(".animation-option").forEach((button) => {
    const selected = button.dataset.variant === state.variant;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

document.querySelectorAll(".animation-option").forEach((button) => {
  button.addEventListener("click", () => {
    writeVariant(button.dataset.variant, true);
    restartLoadingMotion();
  });
});

document.getElementById("cycleVariant").addEventListener("click", () => {
  writeVariant(nextVariant(), true);
  restartLoadingMotion();
});

document.getElementById("restartSimulation").addEventListener("click", () => {
  restartLoadingMotion();
});

window.addEventListener("hashchange", () => {
  state.variant = readVariant();
  syncVariantPicker();
  renderRows();
});

renderRows();
syncVariantPicker();
