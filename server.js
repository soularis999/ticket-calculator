#!/usr/bin/env node

"use strict";

const logger = require("./winston");
const path = require("path");
const express = require("express");
const yargs = require("yargs");
const bodyParser = require("body-parser");

var app = express();
app.use((req, resp, next) => {
  logger.info(req.path);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "ui/dist/ui")));

// add router for the main render
app.use("/api/", require("./handler"));

var port = yargs.argv.port || process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`start server on :${port}`);
});
