const eventsJSON = await (await fetch("./events.json")).json();
const labels = document.querySelector("#labels");
const giTimeline = document.querySelector("#gi-timeline");
const hsrTimeline = document.querySelector("#hsr-timeline");
const zzzTimeline = document.querySelector("#zzz-timeline");

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;

const weekdayDict = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const gameDict = { genshin: giTimeline, hsr: hsrTimeline, zzz: zzzTimeline };

const timelineStart = new Date(Date.UTC(2024, 7, 1));
const timelineEnd = new Date(Date.UTC(2024, 9, 1));
const now = new Date();

const events = [];
for (const { name, start, end, game } of eventsJSON) {
  console.log(roundTimestamp(start));
  console.log(timelineStart);
  console.log(daysDiff(timelineStart, roundTimestamp(start)));
  events.push({
    name,
    game,
    duration: daysDiff(roundTimestamp(start), roundTimestamp(end)),
    start: daysDiff(timelineStart, roundTimestamp(start)),
    timeLeft: timeDiff(now, new Date(end)),
  });
}

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
nowDiv.style.setProperty("--now", daysDiff(timelineStart, new Date()));
nowDiv.scrollIntoView({
  behavior: "smooth",
  block: "nearest",
  inline: "center",
});

//add events
for (const { name, duration, start, game, timeLeft } of events) {
  addEvent(name, duration, start, gameDict[game], timeLeft);
}

function addEvent(name, duration, start, timeline, timeLeft = "N/A") {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");
  //   eventDiv.style = `--duration: ${duration}; --start: ${start}`;
  eventDiv.style.setProperty("--duration", duration);
  eventDiv.style.setProperty("--start", start);

  const eventSpan = document.createElement("span");
  eventSpan.innerText = name;
  eventDiv.append(eventSpan);

  const timeDiv = document.createElement("span");
  timeDiv.classList.add("time");
  timeDiv.innerText = timeLeft;
  eventDiv.append(timeDiv);
  timeline.append(eventDiv);
}

function daysDiff(a, b) {
  return Math.floor((b.valueOf() - a.valueOf()) / DAY) + 1;
}
function timeDiff(a, b) {
  const diffTime = Math.floor(b.valueOf() - a.valueOf());
  const days = Math.floor(diffTime / DAY);
  const hours = Math.floor((diffTime % DAY) / HOUR);
  const minutes = Math.floor((diffTime % HOUR) / MINUTE);
  return `${days}d${hours}h${minutes}m`;
}
function roundTimestamp(timestring) {
  return new Date(Math.floor(Date.parse(timestring) / DAY) * DAY);
}
