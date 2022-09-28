function sortDates(unsortedDates){
   return unsortedDates.sort( (a, b) =>  { 
        a = new Date(a.date);
        b = new Date(b.date);
        return a >b ? -1 : a < b ? 1 : 0;
       });
}


function sortArray(unsortedArray){
   return unsortedArray.sort((a, b) => {return a - b})
}


module.exports = {
    sortArray,
    sortDates
}