'use strict';

var calc = require('../calc');

describe('test calculating days', () => {
    test('testing calculator without days off for oct 2018', (done) => {
	expect(calc.calcNumDays(10,2018,[])).toBe(23);
	done();
    });

    test('testing calculator with just weekend days off for oct 2018', (done) => {
	// just weekends
	expect(calc.calcNumDays(10,2018,[6,7,27,28])).toBe(23);
	done();
    });

    test('testing calculator with week days off for oct 2018', (done) => {
	// just weekdays
	expect(calc.calcNumDays(10,2018,[29,30,31])).toBe(20);
	done();
    });

    test('testing calculator with week days off and empty value for oct 2018', (done) => {
	// just weekdays
	expect(calc.calcNumDays(10,2018,[29, ,30,,31,])).toBe(20);
	done();
    });

    test('testing calculator with week and weekends off for feb 2018', (done) => {
	// just weekdays
	expect(calc.calcNumDays(2,2018,[27,28,29,30,31])).toBe(18);
	done();
    });
});

describe('test calculating prices', () => {
    var data = {monthly: 10, tenRide: 6, single:2};
    test('test short interval without returns', () => {
	let result = calc.calcAllValues(data, 2);
	expect(result[0].price).toBe(2 * 2);
    });

    test('test short interval with returns', () => {
	let result = calc.calcAllValues(data, 4);
	expect(result[0].price).toBe(6); 
    });

    test('test medium interval ', () => {
	let result = calc.calcAllValues(data, 10);
	expect(result[0].price).toBe(6); 
    });

    test('test medium interval with returns', () => {
	let result = calc.calcAllValues(data, 20);
	expect(result[0].price).toBe(10); 
    });

    test('test long interval ', () => {
	let result = calc.calcAllValues(data, 20);
	expect(result[0].price).toBe(10); 
    });

    test('test medium interval with returns', () => {
	let result = calc.calcAllValues(data, 40);
	expect(result[0].price).toBe(10); 
    });
});

