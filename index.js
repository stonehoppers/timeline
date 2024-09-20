const eventsJSON = await (await fetch("./events.json")).json();
const labels = document.querySelector("#labels");
const giTimeline = document.querySelector("#gi-timeline");
const hsrTimeline = document.querySelector("#hsr-timeline");
const zzzTimeline = document.querySelector("#zzz-timeline");
const hi3Timeline = document.querySelector("#hi3-timeline");

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;

const weekdayDict = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const gameDict = {
  genshin: giTimeline,
  hsr: hsrTimeline,
  zzz: zzzTimeline,
  hi3: hi3Timeline,
};

const now = new Date();
const timelineStart = new Date(
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
);
const timelineEnd = new Date(
  Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0)
);
console.log(timelineStart, timelineEnd);

//add events
const events = [];
for (const { name, start, end, game } of eventsJSON) {
  events.push({
    name,
    game,
    start: daysDiff(timelineStart, new Date(start)),
    duration: daysDiff(timelineStart, new Date(end)),
    timeLeft: new Date(end) - now,
  });
  // break;
}
for (const { name, duration, start, game, timeLeft } of events) {
  addEvent(name, duration, start, gameDict[game], timeLeft);
}

//#region MONTHS
//add months labels
for (
  let __current = timelineStart;
  __current - timelineEnd < 0;
  __current = new Date(__current.valueOf() + DAY)
) {
  console.log("CURRENT", __current);
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");
  dayDiv.innerText = __current.getDate();
  labels.append(dayDiv);

  const weekdayDiv = document.createElement("div");
  weekdayDiv.classList.add("weekday");
  weekdayDiv.innerText = weekdayDict[__current.getDay()];
  labels.append(weekdayDiv);
}

//#region NOW
const nowDiv = document.querySelector("#now");
nowDiv.style.setProperty("--now", daysDiff(timelineStart, now));
nowDiv.scrollIntoView({
  behavior: "smooth",
  // block: "start",
  inline: "center",
});

//#region FUNCTIONS
function addEvent(name, start, duration, timeline, timeLeft = "N/A") {
  if (duration < 0) return;
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");
  eventDiv.style.setProperty("--start", start > 0 ? start : 1);
  eventDiv.style.setProperty("--duration", duration);

  const eventSpan = document.createElement("div");
  eventSpan.innerText = name;
  eventDiv.append(eventSpan);

  const timeDiv = document.createElement("div");
  timeDiv.classList.add("time");
  const { days, hours, minutes } = parseMilliseconds(timeLeft);
  if (timeLeft > 0) {
    timeDiv.innerText = `${days}d${hours}h${minutes}m`;
    if (timeLeft < DAY * 7) timeDiv.classList.add("expiring-7d");
    if (timeLeft < DAY * 3) timeDiv.classList.add("expiring-3d");
    if (timeLeft < DAY) timeDiv.classList.add("expiring-1d");
  } else {
    timeDiv.innerText = "Expired";
    timeDiv.classList.add("expired");
  }
  eventDiv.append(timeDiv);

  timeline.append(eventDiv);
}

function daysDiff(start, end) {
  const { days, hours } = parseMilliseconds(end - start);
  return days * 48 + hours * 2;
}
function parseMilliseconds(milliseconds) {
  const days = Math.floor(milliseconds / DAY);
  const hours = Math.floor((milliseconds % DAY) / HOUR);
  const minutes = Math.floor((milliseconds % HOUR) / MINUTE);
  return { days, hours, minutes };
}
function roundTimestamp(timestring) {
  return new Date(Math.floor(Date.parse(timestring) / DAY) * DAY);
}
