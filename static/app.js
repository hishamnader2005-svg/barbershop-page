const state = {
  service: null,
  price: 0,
  barber: null,
  date: null,
  time: null,
  service_id: null,
  barber_id: null,
};

let currentYear = 2026;
let currentMonth = 2;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ALL_SLOTS = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];
const UNAVAILABLE = [3, 7, 11, 15];

function scrollTo(id) {
  document.querySelector(id).scrollIntoView({ behavior: "smooth" });
}

async function loadServices() {
  const response = await fetch("/api/services");
  const services = await response.json();

  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = "";

  services.forEach((service) => {
    grid.innerHTML += `
      <div class="service-card"
        data-service="${service.name}"
        data-price="${service.price}"
        data-duration="${service.duration_minutes}min"
        data-id="${service.id}"
        onclick="selectService(this)">
        <div class="service-name">${service.name}</div>
        <div class="service-desc">${service.description}</div>
        <div class="service-footer">
          <div class="service-price">€${service.price}</div>
          <div class="service-duration">${service.duration_minutes} min</div>
        </div>
        <button class="service-select-btn">Select</button>
      </div>
    `;
  });
}

async function loadBarbers() {
  const response = await fetch("/api/barbers");
  const barbers = await response.json();

  const grid = document.getElementById("staffGrid");
  grid.innerHTML = "";

  barbers.forEach((barber) => {
    grid.innerHTML += `
      <div class="staff-card" data-barber="${barber.name}" data-id="${barber.id}" onclick="selectBarber(this)">
        <div class="staff-avatar">
          <div class="staff-initials">${barber.name[0]}</div>
        </div>
        <div class="staff-title">${barber.title}</div>
        <div class="staff-name">${barber.name}</div>
        <div class="staff-bio">${barber.bio}</div>
      </div>
    `;
  });

  grid.innerHTML += `
    <div class="staff-card" data-barber="Any" data-id="1" onclick="selectBarber(this)">
      <div class="staff-avatar">
        <div class="staff-initials">?</div>
      </div>
      <div class="staff-title">Available</div>
      <div class="staff-name">No preference</div>
      <div class="staff-bio">We'll match you with whoever's available first.</div>
    </div>
  `;
}

async function checkAuth() {
  const response = await fetch("/api/me");
  const nav = document.getElementById("authButtons");

  if (response.ok) {
    const data = await response.json();
    nav.innerHTML = `
      <span style="color:var(--muted);font-size:13px;font-family:'DM Mono',monospace;">${data.email}</span>
      <button class="btn-secondary" style="padding:10px 20px;" onclick="logout()">Logout</button>
      <button class="nav-book" onclick="scrollTo('#booking')">Book Now</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="/login"><button class="btn-secondary" style="padding:10px 20px;">Login</button></a>
      <a href="/signup"><button class="btn-secondary" style="padding:10px 20px;">Sign Up</button></a>
      <button class="nav-book" onclick="scrollTo('#booking')">Book Now</button>
    `;
  }
}

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  window.location.reload();
}

function selectService(card) {
  document
    .querySelectorAll(".service-card")
    .forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  state.service = card.dataset.service;
  state.price = parseInt(card.dataset.price);
  state.service_id = parseInt(card.dataset.id);
  updateSummary();
  document.getElementById("step1").className = "step done";
}

function selectBarber(card) {
  document
    .querySelectorAll(".staff-card")
    .forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  state.barber = card.dataset.barber;
  state.barber_id = parseInt(card.dataset.id);
  updateSummary();
  document.getElementById("step2").className = "step done";
}

function renderCalendar() {
  document.getElementById("calMonth").textContent =
    `${MONTHS[currentMonth]} ${currentYear}`;
  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";

  DAYS.forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-day-label";
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement("div");
    el.className = "cal-day empty";
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement("div");
    const date = new Date(currentYear, currentMonth, d);
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < new Date(today.toDateString());
    const isSunday = date.getDay() === 0;

    el.className =
      "cal-day" +
      (isPast || isSunday ? " past" : "") +
      (isToday ? " today" : "");
    el.textContent = d;

    if (!isPast && !isSunday) {
      el.onclick = () => selectDate(d, el);
    }
    grid.appendChild(el);
  }
}

function selectDate(d, el) {
  document
    .querySelectorAll(".cal-day")
    .forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
  state.date = `${d} ${MONTHS[currentMonth]} ${currentYear}`;
  state.time = null;
  document.getElementById("selectedDateLabel").textContent = state.date;
  document.getElementById("step3").className = "step active";
  renderSlots(d);
  updateSummary();
}

function prevMonth() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else currentMonth--;
  renderCalendar();
}

function nextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else currentMonth++;
  renderCalendar();
}

function renderSlots(day) {
  const grid = document.getElementById("slotsGrid");
  grid.innerHTML = "";
  ALL_SLOTS.forEach((time, i) => {
    const btn = document.createElement("button");
    const unavail = UNAVAILABLE.includes((day + i) % 20);
    btn.className = "slot" + (unavail ? " unavailable" : "");
    btn.textContent = time;
    if (!unavail) btn.onclick = () => selectTime(time, btn);
    grid.appendChild(btn);
  });
}

function selectTime(time, btn) {
  document
    .querySelectorAll(".slot")
    .forEach((s) => s.classList.remove("selected"));
  btn.classList.add("selected");
  state.time = time;
  updateSummary();
  document.getElementById("step4").className = "step active";
  document.getElementById("contactForm").style.display = "block";
  setTimeout(() => {
    document
      .getElementById("contactForm")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function updateSummary() {
  document.getElementById("sumService").textContent = state.service || "—";
  document.getElementById("sumBarber").textContent = state.barber || "—";
  document.getElementById("sumDate").textContent = state.date || "—";
  document.getElementById("sumTime").textContent = state.time || "—";
  document.getElementById("sumPrice").textContent = state.price
    ? `€${state.price}`
    : "€—";
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 16);
  input.value = v.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 2) v = v.slice(0, 2) + " / " + v.slice(2);
  input.value = v;
}

async function confirmBooking() {
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const email = document.getElementById("email").value;

  if (!fname || !lname) {
    alert("Please enter your name.");
    return;
  }
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  if (!state.service_id || !state.barber_id || !state.date || !state.time) {
    alert("Please complete all booking steps first.");
    return;
  }

  const authCheck = await fetch("/api/me");
  if (!authCheck.ok) {
    window.location.href = "/login";
    return;
  }

  const user = await authCheck.json();

  const [day, month, year] = state.date.split(" ");
  const months = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  const formattedDate = `${year}-${months[month]}-${day.padStart(2, "0")}`;
  const formattedTime = state.time.padStart(5, "0");

  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.user_id,
      barber_id: state.barber_id,
      service_id: state.service_id,
      booking_date: formattedDate,
      booking_time: formattedTime,
    }),
  });

  const result = await response.json();

  if (response.ok) {
    document.getElementById("contactForm").style.display = "none";
    const screen = document.getElementById("successScreen");
    screen.classList.add("show");
    document.getElementById("successMsg").textContent =
      `${state.service} with ${state.barber === "Any" ? "a barber" : state.barber} on ${state.date} at ${state.time}.`;
    screen.scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Something went wrong. Please try again.");
  }
}

function resetBooking() {
  location.reload();
}

renderCalendar();
loadServices();
loadBarbers();
checkAuth();
