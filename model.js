'use strict';

const logger = require('./winston');
const _ = require('lodash');
const fs = require('fs');

const model = {};

var init = () => {
    if(!("values" in model)) {
	if(fs.existsSync('model.json')) {
	    var values = fs.readFileSync('model.json');
	    model.values = JSON.parse(values);
	    logger.info(`Checked and loaded: ${JSON.stringify(model)}`);
	}
	else {
	    throw "Model file not found";
	}
    }
};

var getGroups = () => {
    init();
    return _.map(model.values, (val) => {
	return val.group;
    });
};

var getModel = (group) => {
    init();
    return _.find(model.values, function(data) { return group === data.group; });
};

module.exports = {
    getGroups,
    getModel
};
