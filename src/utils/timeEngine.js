export function getESTTime() {
  const now = new Date();

  const est = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    weekday: "short"
  }).formatToParts(now);

  const day = est.find(p => p.type === "weekday").value;
  const hour = est.find(p => p.type === "hour").value;
  const minute = est.find(p => p.type === "minute").value;
  const period = est.find(p => p.type === "dayPeriod").value;

  return {
    day,
    time: `${hour}:${minute} ${period}`
  };
}

export function getISTTime() {
  const now = new Date();

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    weekday: "short"
  }).format(now);
}