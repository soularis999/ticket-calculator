#!/usr/bin/env node

'use strict';

const render = require('./render');
const logger = require("./winston");

const express = require('express');
const hbs = require('hbs');
const yargs = require('yargs');

var app = express();

// Defines the view engine to delegate to handlebar
app.set('view engine', 'hbs');

// will register directory where the partial templates hbs files will be
// located. The partial templates will be reused by main pages
hbs.registerPartials(__dirname + '/views/partials/');

// add router for the main render
app.use('/', render);

var port = yargs.argv.port || process.env.PORT || 3000;

app.listen(port, () => {
    logger.info(`start server on :${port}`);
});

