'use strict';

const logger = require('./winston');
const _ = require('lodash');

function calculateSkipDates(skipDateStr) {
    logger.debug(`In skip dates ${skipDateStr}`);
    if(undefined === skipDateStr) {
	return [];
    }
    
    let skipDates = _.filter(_.map(_.split(skipDateStr, ","), (date) => {
	date = _.trim(date);
	if("" == date) {
	    return null;
	}
	return date;
    }), (date) => null != date);

    logger.debug(`In skip dates ${skipDates}`);
    
    skipDates = _.flattenDepth(_.map(skipDates, (dateStr) => {
	let split = _.split(dateStr, "-");
	if(1 == split.length) {
	    return parseInt(dateStr);
	}
	if(2 != split.length) {
	    throw `more than two values in range ${dateStr}`;
	}
	let first = parseInt(split[0]);
	let last = parseInt(split[1]);
	let len = last - first;
	if(len < 0) {
	    throw `Incorrect range ${dateStr}`;
	} else if(0 == len) {
	    return first;
	}
	return _.range(first, last + 1);
	// TODO: test 1. out of range, 2. one of range values missing
    }), 1);
    logger.debug(`Skip dates ${skipDates}`);
    return skipDates;
};

module.exports = {
    calculateSkipDates
};
