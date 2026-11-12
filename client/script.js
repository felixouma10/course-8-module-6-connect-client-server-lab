const eventsUrl = "http://localhost:5000/events";
const eventList = document.querySelector("#event-list");
const eventForm = document.querySelector("form");
const titleInput = document.querySelector("#title");
const formMessage = document.querySelector("#form-message");

function renderEvent(event) {
  const li = document.createElement("li");
  li.textContent = event.title;
  eventList.appendChild(li);
}

async function loadEvents() {
  try {
    const response = await fetch(eventsUrl);
    if (!response.ok) {
      throw new Error("Unable to load events.");
    }

    const events = await response.json();
    events.forEach(renderEvent);
  } catch (error) {
    formMessage.textContent = error.message;
  }
}

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    formMessage.textContent = "Enter an event title.";
    titleInput.focus();
    return;
  }

  formMessage.textContent = "";
  try {
    const response = await fetch(eventsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to add event.");
    }

    renderEvent(result);
    eventForm.reset();
    titleInput.focus();
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

loadEvents();