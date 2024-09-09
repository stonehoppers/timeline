const labels = document.querySelector("#labels");
const giTimeline = document.querySelector("#gi-timeline");
const hsrTimeline = document.querySelector("#hsr-timeline");
const zzzTimeline = document.querySelector("#zzz-timeline");

const weekdayDict = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const gameDict = { genshin: giTimeline, hsr: hsrTimeline, zzz: zzzTimeline };

const start = new Date(Date.UTC(2024, 7, 1));
const end = new Date(Date.UTC(2024, 9, 1));
const now = new Date();

const events = [
  { name: "Traces of Artistry", duration: 19, start: 28, game: "genshin" },
  { name: "Brillant Dawn", duration: 19, start: 30, game: "genshin" },
  {
    name: "Dodoco's Boom-Bastic Escapades",
    duration: 14,
    start: 40,
    game: "genshin",
  },
  { name: "Camelia Golden Week", duration: 14, start: 40, game: "zzz" },
  { name: '"En-Nah" Into Your Lap', duration: 21, start: 33, game: "zzz" },
];

//add months labels
for (let i = 1; i <= 31; i++) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");
  dayDiv.innerText = i;
  labels.append(dayDiv);

  const weekdayDiv = document.createElement("div");
  weekdayDiv.classList.add("weekday");
  weekdayDiv.innerText = weekdayDict[(i - 1 + 3) % 7];
  labels.append(weekdayDiv);
}
for (let i = 1; i <= 30; i++) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");
  dayDiv.innerText = i;
  labels.append(dayDiv);

  const weekdayDiv = document.createElement("div");
  weekdayDiv.classList.add("weekday");
  weekdayDiv.innerText = weekdayDict[(i - 1 + 6) % 7];
  labels.append(weekdayDiv);
}

const nowDiv = document.querySelector("#now");
nowDiv.style.setProperty("--now", daysDiff(start, new Date()));
nowDiv.scrollIntoView({
  behavior: "smooth",
  block: "nearest",
  inline: "center",
});

//add events
for (const { name, duration, start, game } of events) {
  addEvent(name, duration, start, gameDict[game]);
}

function addEvent(name, duration, start, timeline) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");
  //   eventDiv.style = `--duration: ${duration}; --start: ${start}`;
  eventDiv.style.setProperty("--duration", duration);
  eventDiv.style.setProperty("--start", start);

  const eventSpan = document.createElement("span");
  eventSpan.innerText = name;

  eventDiv.append(eventSpan);
  timeline.append(eventDiv);
}

function daysDiff(a, b) {
  return Math.ceil((b.valueOf() - a.valueOf()) / (1000 * 60 * 60 * 24));
}
