var expect  = require('chai').expect;
var calc = require('../calc');

describe('test calculating days', () => {
    it('testing calculator without days off for oct 2018', (done) => {
	expect(calc.calcNumDays(10,2018,[])).to.equal(23);
	done();
    });

    it('testing calculator with just weekend days off for oct 2018', (done) => {
	// just weekends
	expect(calc.calcNumDays(10,2018,[6,7,27,28])).to.equal(23);
	done();
    });

    it('testing calculator with week days off for oct 2018', (done) => {
	// just weekdays
	expect(calc.calcNumDays(10,2018,[29,30,31])).to.equal(20);
	done();
    });

    it('testing calculator with week and weekends off for feb 2018', (done) => {
	// just weekdays
	expect(calc.calcNumDays(2,2018,[27,28,29,30,31])).to.equal(18);
	done();
    });
});

describe('test calculating prices', () => {
    var data = {monthly: 10, tenRide: 6, single:2};
    it('test short interval without returns', () => {
	let result = calc.calcAllValues(data, 2, false);
	expect(result[0].price).to.equal(2 * 2);
    });

    it('test short interval with returns', () => {
	result = calc.calcAllValues(data, 2, true);
	expect(result[0].price).to.equal(6); 
    });

    it('test medium interval ', () => {
	result = calc.calcAllValues(data, 10, false);
	expect(result[0].price).to.equal(6); 
    });

    it('test medium interval with returns', () => {
	result = calc.calcAllValues(data, 10, true);
	expect(result[0].price).to.equal(10); 
    });

    it('test long interval ', () => {
	result = calc.calcAllValues(data, 20, false);
	expect(result[0].price).to.equal(10); 
    });

    it('test medium interval with returns', () => {
	result = calc.calcAllValues(data, 20, true);
	expect(result[0].price).to.equal(10); 
    });
});
