let chart;
let historyChart;
let historyData = [];
let labels = [];
let currentMode = "Work";
let seconds = 0;

// 🔐 LOGIN
function login() {
  const name = document.getElementById("username").value;
  if (!name) return;

  localStorage.setItem("user", name);

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("welcome").innerText = "Welcome, " + name;
}

// 🔄 PAGE SWITCH
function showPage(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
}

// 🎛 MODE
function setMode(mode) {
  currentMode = mode;
  document.getElementById("mode").innerText = "Mode: " + mode;
}

// ⏱ SESSION TIMER
setInterval(() => {
  seconds++;
  document.getElementById("timer").innerText = "Session: " + seconds + "s";
}, 1000);

// 🧠 MAIN DATA LOOP
async function fetchData() {
  const res = await fetch("http://127.0.0.1:8000/signal");
  const data = await res.json();

  // 🎛 MODE IMPACT
  let adjustedFocus = data.focus;

  if (currentMode === "Work") adjustedFocus += 5;
  if (currentMode === "Study") adjustedFocus += 2;
  if (currentMode === "Athlete") adjustedFocus -= 5;

  adjustedFocus = Math.max(0, Math.min(100, adjustedFocus));

  const fatigue = 100 - adjustedFocus;
  const performance = Math.floor(adjustedFocus * 0.7 + (100 - fatigue) * 0.3);

  // 📊 UPDATE UI
  document.getElementById("focus").innerText = adjustedFocus;
  document.getElementById("fatigue").innerText = fatigue;
  document.getElementById("performance").innerText = performance;

  // 🟢 STATUS BADGE
  const statusEl = document.getElementById("status");
  statusEl.innerText = data.status;
  statusEl.className = "badge " + (data.status === "LOW" ? "low" : "high");

  // ⚠ ALERT
  document.getElementById("alert").innerText =
    adjustedFocus < 60 ? "⚠️ Cognitive performance dropping" : "";

  // 🧠 AI COACHING
  let coaching = "";

  if (adjustedFocus < 50) {
    coaching = "🛑 Your brain is fatigued. Take a break.";
  } else if (adjustedFocus < 70) {
    coaching = "⚡ Stable state. Continue light work.";
  } else {
    coaching = "🚀 Peak state. Do deep work NOW.";
  }

  document.getElementById("coach").innerText = coaching;

  // 📈 HISTORY TRACK
  historyData.push(adjustedFocus);
  labels.push(labels.length + 1);

  if (historyData.length > 30) {
    historyData.shift();
    labels.shift();
  }

  // 📉 SIGNAL GRAPH
  if (!chart) {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.signal.map((_, i) => i),
        datasets: [
          {
            data: data.signal,
            borderColor: "#22c55e",
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
    });
  } else {
    chart.data.datasets[0].data = data.signal;
    chart.update();
  }

  updateHistoryChart();
}

// 📊 HISTORY GRAPH
function updateHistoryChart() {
  const ctx = document.getElementById("historyChart").getContext("2d");

  if (!historyChart) {
    historyChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Focus Trend",
            data: historyData,
            borderColor: "#facc15",
            tension: 0.4,
            pointRadius: 3,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 100,
          },
        },
      },
    });
  } else {
    historyChart.data.labels = labels;
    historyChart.data.datasets[0].data = historyData;
    historyChart.update();
  }
}

setInterval(fetchData, 1000);
