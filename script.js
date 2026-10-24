
const sosBtn = document.getElementById("sosBtn");
const sosStatus = document.getElementById("sosStatus");

sosBtn.addEventListener("click", () => {
  const confirmed = confirm(
    "Start the SafeHer demo emergency workflow?"
  );

  if (confirmed) {
    sosStatus.textContent =
      "Demo alert activated. No message has been sent.";
    alert(
      "Demo only: contact a trusted person or local emergency services directly if you need help."
    );
  }
});

// Safety check-in timer
let timerId = null;

document.getElementById("startTimer").addEventListener("click", () => {
  clearTimeout(timerId);

  const minutes = Number(document.getElementById("minutes").value);
  const status = document.getElementById("timerStatus");

  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    status.textContent = "Enter a whole number between 1 and 180.";
    return;
  }

  status.textContent = `Check-in reminder set for ${minutes} minute(s).`;

  timerId = setTimeout(() => {
    status.textContent = "Check-in time! Please confirm your safety.";
    alert("SafeHer check-in reminder. Please confirm your status.");
    timerId = null;
  }, minutes * 60 * 1000);
});

document.getElementById("stopTimer").addEventListener("click", () => {
  clearTimeout(timerId);
  timerId = null;
  document.getElementById("timerStatus").textContent =
    "Timer stopped.";
});

// Get location with browser permission
document.getElementById("locationBtn").addEventListener("click", () => {
  const status = document.getElementById("locationStatus");
  const mapLink = document.getElementById("mapLink");

  mapLink.hidden = true;

  if (!navigator.geolocation) {
    status.textContent = "Location is not supported by this browser.";
    return;
  }

  status.textContent = "Waiting for location permission...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      status.textContent = "Location obtained on this device.";

      mapLink.href =
        `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;

      mapLink.textContent = "Open my location on map";
      mapLink.hidden = false;
    },
    () => {
      status.textContent =
        "Location unavailable. Check browser permission and try again.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// Store a trusted contact in this browser
document.getElementById("saveContact").addEventListener("click", () => {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const status = document.getElementById("contactStatus");

  if (!name || !/^[+0-9() -]{7,20}$/.test(phone)) {
    status.textContent = "Enter a contact name and valid phone number.";
    return;
  }

  try {
    localStorage.setItem(
      "safeherContact",
      JSON.stringify({ name, phone })
    );
    status.textContent = `Contact saved on this browser: ${name}`;
  } catch {
    status.textContent = "Could not save contact in this browser.";
  }
});

// Prepare an alert message; this does not send it
document.getElementById("prepareAlert").addEventListener("click", () => {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const messageBox = document.getElementById("alertMessage");

  if (!name || !phone) {
    messageBox.value = "Add a trusted contact first.";
    return;
  }

  messageBox.value =
    `Hi ${name}, I may need assistance. Please contact me and check if I am safe.`;
});
