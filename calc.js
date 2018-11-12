const _ = require('lodash');

/**
 * month - 1 based month of the year (1-jan, 2-feb,...,12-dec)
 * year - full year (2018)
 * days off - array of dates off [1,2,3,28] or empty array
 */
var calcNumDays = (month, year, daysOff) => {
    let set = new Set(daysOff);
    let lastDay = new Date(year, month, 0);
    let num = 0;
    for(let day = 1; day <= lastDay.getDate(); day++) {
	let date = new Date(lastDay.getFullYear(), lastDay.getMonth(), day);
	if(0 == date.getDay() || 6 == date.getDay() || set.has(date.getDate())) {
	    continue;
	}
	console.log(`${day} = ${date}`);
	num++;
    }
    return num;
};

/**
 * Calculate all values given prices and days to travel
 * provided data will be in form of {monthly: <price>, tenRide: <price>, single: <price>}
 */
var calcAllValues = (data, days, withReturn = true) => {
    let rides = withReturn ? days * 2 : days;
      var prices = [{type: "monthly", price: data.monthly, description: "1 monthly ticket"},
		  {type: "single", price: rides * data.single, description: `${rides} single tickets`}];
    var ten = {type: "tenRide", price: data.tenRide};
    prices.push(ten);
    
    if(rides > 10) {
	let numTenRides = _.floor(rides / 10);
	let numSingleRides = (rides % 10);
	ten.price = data.tenRide * numTenRides + data.single * numSingleRides;
	ten.description = `${numTenRides} ten rides and ${numSingleRides} single rides`;
    }

    console.log(prices);
    prices.sort((o1,o2) => {
	return o1.price < o2.price ? -1 : o1.price > o2.price ? 1 : 0;
    });

    return prices;
};

module.exports = {
    calcNumDays,
    calcAllValues
};
