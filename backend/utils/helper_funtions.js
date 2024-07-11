function sortDates(unsortedDates) {
  return unsortedDates.sort((a, b) => {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
}

function sortArray(unsortedArray) {
  return unsortedArray.sort((a, b) => {
    return a - b;
  });
}

const calculateWorkingHours = (checkIn, checkOut) => {
  const checkInSecs = changeToSeconds(checkIn);
  const checkOutSecs = changeToSeconds(checkOut);
  const workHrs = checkOutSecs - checkInSecs;
  const workHrsTime = convertToHMInString(workHrs.toString());
  return workHrsTime;
};

function convertToHMInString(seconds) {
  const hours = Math.floor(Number(seconds) / 3600);
  const minutes = Math.floor((Number(seconds) % 3600) / 60);
  return `${hours}hr ${minutes}m`;
}
function changeToSeconds(time) {
  /// time should be in the format 00:00
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

module.exports = {
  sortArray,
  sortDates,
  calculateWorkingHours,
};
