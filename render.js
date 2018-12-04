#!/usr/bin/env node

'use strict';

const calc = require("./calc");
const model = require("./model");
const logger = require("./winston");
const utils = require("./utils");

const express = require('express');
const _ = require('lodash');

var router = express.Router();

// simple html output
router.get('/', (request, response) => {
    logger.debug(`ROUTE|${JSON.stringify(request.query)}`);
    parse(request)
	.then((data) => { return processRequest(data);})
	.then((data) => { renderData(data, response); },
	      (errorData) => { renderData(errorData, response); });
});

function renderData(data, resp) {
    let thisData = data || {};
    let groups = model.getGroups();
    let selectedGroup = ("group" in thisData) ? thisData["group"] : "";
    groups = _.map(groups, (group) => {
	let result = {group:group};
	result.selected = (group == selectedGroup);
	return result;
    });
    
    let result = {};
    result.groups = groups;
    result.error = ("error" in thisData) ? thisData.error : "";
    result.date = renderCorrectDate(thisData.date);
    result.skipDate = thisData.skipDate;
    result.roundTrip = thisData.roundTrip;

    if(thisData.result) {
	result.numDays = thisData.numDays;
	result.result = _.map(thisData.result, (result) => {
	    result.ticket = thisData.mod[result.type];
	    return result;
	});
    } else {
	result.numDays = "";
	result.model = [];
    }
    logger.info(`RENDER_DATA|${JSON.stringify(result)}`);
    resp.render("index.hbs", result);
}

function renderCorrectDate(providedDate) {
    if(undefined == providedDate || "" == providedDate) {
	var today = new Date();
	var month = today.getMonth() + 1;
	var year = today.getFullYear();
	if(6 < today.getDate()) {
	    month += 1;
	}
	if(12 < month) {
	    month = 1;
	    year += 1;
	}
	return `${month}/${year}`;
    }
    return providedDate;
};

function parse(req) {
    return new Promise((resolve, reject) => {
	let data = {};

	try {
	    data.group = req.query.group;
	    data.date = req.query.date;
	    data.skipDate = req.query.skipDate
	    data.skipDateParsed = utils.calculateSkipDates(data.skipDate);
	    data.roundTrip = "on" == req.query.roundTrip;

	    if(undefined === data.group && undefined === data.date) {
		resolve(data);
		return;
	    }
    
	    if(undefined == data.group) {
		throw "Group was not selected";
	    }

	    if(undefined == data.date) {
		throw "Date was not provided";
	    }

	    let monthAndYear = _.split(data.date, "/");
	    if(2 != monthAndYear.length) {
		throw "Month and year is not in correct format (MM/YYYY) " + data.date;
	    } else {
		data.month = parseInt(monthAndYear[0]);
		data.year = parseInt(monthAndYear[1]);
		if(data.month < 1 || 12 < data.month) {
		    throw "Month is out of range " + data.date;
		}
	    }

	    if(undefined !== data.skipDateParsed) {
		let d = new Date(data.year, data.month, 0);
		_.forEach(data.skipDateParsed, (date) => {
		    if(date <= 0 || date > d.getDate()) {
			throw `Date is outside range, provided ${date}, last date ${d} in ${data.skipDate} `;
		    }
		});
	    }
	} catch(e) {
	    data.error = `Error: ${e}`;
	    reject(data);
	    return;
	}

	logger.info(`PARSE_REQUEST|${JSON.stringify(data)}`);
	resolve(data);
    });
}


function processRequest(data) {
    return new Promise((resolve, reject) => {
	try {
	    if(undefined === data.group && undefined === data.date) {
		resolve(data);
		return;
	    }
	
	    data.numDays = calc.calcNumDays(data.month, data.year, data.skipDateParsed);
	    data.mod = model.getModel(data.group);
	    if(!data.mod) {
		data.error = "Could not find group " + data.group;
		reject(data);
		return;
	    }
	    let rides = data.roundTrip ? data.numDays * 2 : data.numDays;
	    data.result = calc.calcAllValues(data.mod, rides);
	    resolve(data);
	} catch(e) {
	    data.error = `Error: ${e}`;
	    reject(data);
	}
    });
};

module.exports = router;
