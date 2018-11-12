#!/usr/bin/env node

const calc = require("./calc");
const model = require("./model");
const express = require('express');
const hbs = require('hbs');
const _ = require('lodash');
const yargs = require('yargs');

var app = express();
// Defines the view engine to delegate to handlebar
app.set('view engine', 'hbs');

// will register directory where the partial templates hbs files will be
// located. The partial templates will be reused by main pages
hbs.registerPartials(__dirname + '/views/partials/');

// simple html output
app.get('/', (request, response) => {
    parse(request)
	.then((data) => { return processRequest(data);})
	.then((data) => {renderData(data, response); },
	      (errorData) => {renderData(errorData, response); });
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
    result.skipDate = _.join(thisData.skipDate, ",");
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
    console.log(result);
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

	data.group = req.query.group;
	data.date = req.query.date;
	data.skipDate = _.map(_.split(req.query.skipDate, ","), (date) => {
	    if("" == date) {
		return null;
	    }
	    return parseInt(date);
	});
	data.roundTrip = "on" == req.query.roundTrip;

	if(undefined === data.group && undefined === data.date) {
	    resolve(data);
	    return;
	}
    
	if(undefined == data.group) {
	    data.error = "Group was not selected";
	    reject(data);
	    return;
	}

	if(undefined == data.date) {
	    data.error = "Date was not provided";
	    reject(data);
	    return;
	}

	let monthAndYear = _.split(data.date, "/");
	if(2 != monthAndYear.length) {
	    data.error = "Month and year is not in correct format (MM/YYYY) " + data.date;
	    reject(data);
	    return;
	} else {
	    data.month = parseInt(monthAndYear[0]);
	    data.year = parseInt(monthAndYear[1]);
	    if(data.month < 1 || 12 < data.month) {
		data.error = "Month is out of range " + data.date;
		reject(data);
		return;
	    }
	}

	resolve(data);
    });
}

function processRequest(data) {
    return new Promise((resolve, reject) => {
	if(undefined === data.group && undefined === data.date) {
	    resolve(data);
	    return;
	}
	
	data.numDays = calc.calcNumDays(data.month, data.year, data.skipDate);
	data.mod = model.getModel(data.group);
	if(!data.mod) {
	    data.error = "Could not find group " + data.group;
	    reject(data);
	    return;
	}
	data.result = calc.calcAllValues(data.mod, data.numDays, data.roundTrip);
	resolve(data);
    });
};

var port = yargs.argv.port || process.env.TICKET_CALC_APP_PORT || 3000;
app.listen(port, () => {
    console.info(`start server on :${port}`);
});
