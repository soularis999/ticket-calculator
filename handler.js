#!/usr/bin/env node

"use strict";

const calc = require("./calc");
const model = require("./model");
const logger = require("./winston");

const express = require("express");
const _ = require("lodash");

var router = express.Router();

router.get("/groups/", (request, response) => {
  response.send(model.getGroups());
});

router.post("/", (request, response) => {
  const data = request.body;
  logger.info(`CALC|${JSON.stringify(data)}`);
  try {
    const result = processRequest(data);
    response.send(result);
  } catch(e) {
    response.send(e);
  }
});

const processRequest = (data) => {
  if (undefined === data.group) {
    throw new Error("No group provided " + data);
  }

  if (undefined === data.month || undefined === data.year) {
    throw new Error("Month / Year not provided " + data);
  }

  data.numDays = calc.calcNumDays(data.month, data.year, data.skip);
  data.mod = model.getModel(data.group);
  if (!data.mod) {
    throw new Error("Could not find data for group " + data.group);
  }
  let rides = data.isRoundTrip ? data.numDays * 2 : data.numDays;
  return calc.calcAllValues(data.mod, rides);
};

module.exports = router;
