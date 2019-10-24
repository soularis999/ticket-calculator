# ticketCalc

## Purpose:
The goal of the project is to calculate optimal tickets combination for Chicago Metra Rail. The idea is that in some scenarios it's cheaper to buy several 10 ride tickets vs buying the monthly ticket. The price of tickets is predefined so this calculation could have been done once and stored however this code does not do that and instead calculates everything on every request.

This is also a minimalistic UI / web application written in node.js. Thought UI part might be extanded in the future.

## Requirements:
npm / node

## Build:
Run the following command in the directory <br/>
<i>npm install</i>

It's also recommended to run tests <br/>
<i>npm test</i>

## Run:
Run the following command in the directory <br/>
<i>npm start</i>

The server will default to port 3000. However, this can we overriden by
env variable TICKET_CALC_APP_PORT

DEPLOY:
heroku container:push web -a ticket-calc
heroku container:release -a ticket-calc web