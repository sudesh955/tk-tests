'use strict';

const Suite = require('../index')
, assert = require('assert');

function factorial(n) {
	var result = 1;
	do {
		result *= n;
	} while(--n);
	return result;
}

const tests = {
	'always_pass_test' : () => 'Passed'
	, 'always_fail_test': () => {throw new Error("Failed")}
}

tests.factorial = function () {
	assert.equal(factorial(6), 720);
}

new Suite({verbose: true}).runTest(tests);
new Suite({verbose: false}).runTest(tests).on('finish', process.exit);