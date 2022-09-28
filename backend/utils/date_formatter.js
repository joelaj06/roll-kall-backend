function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getLastDate(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
  }

  function getPreviousDateByDays(date, days){
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result.toISOString().split('T')[0];
  }
  

  module.exports = {addDays, getLastDate, getPreviousDateByDays}
