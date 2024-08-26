function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getLastDate(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

function getPreviousDateByDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result.toISOString().split("T")[0];
}

function getAllPreviousDatesByDays(days) {
  let dates = [];
  let now = new Date();
  dates.push(now.toISOString().split("T")[0]);
  for (i = 1; i < days; i++) {
    dates.push(getPreviousDateByDays(now, i));
  }
  return dates;
}

function changeToSeconds(date) {
  const newDate = new Date(date); // assuming date is a string in the format "YYYY-MM-DD HH:MM:SS"
  // convert to milliseconds, subtract from current time, and divide by 1000 to get seconds
  const secs = Math.floor(newDate.getTime() / 1000);
  return secs;
}

function convertToHM(value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes;
}

module.exports = {
  addDays,
  getLastDate,
  getPreviousDateByDays,
  getAllPreviousDatesByDays,
  changeToSeconds,
  convertToHM,
};
