'use strict';

const EventEmitter = require('events').EventEmitter;

function Suite (options) {
	options = options || {};
	this.verbose = options.verbose || false;
	this.log = options.log || console.log;
	this.resetCounter();
}

if (Object.setPrototypeOf) {
	Object.setPrototypeOf(Suite.prototype, EventEmitter.prototype);
} else if (Object.create) {
	Suite.prototype = Object.create(EventEmitter.prototype);
	Suite.prototype.constructor = Suite;
} else {
	Suite.prototype.__proto__ = EventEmitter.prototype;
}

Suite.prototype.runTest = function (test, name) {
	if (test instanceof Function) {
		this.totalTests++;
		Promise.resolve(this).then(test)
		.then(
			result => this.onTestPassed(name, result)
			, error => this.onTestFailed(name, error)
		);
	} else {
		for (var t in test) {
			this.runTest(test[t], name ? name + '.' + t : t);
		}
	}
	return this;
};

Suite.prototype.resetCounter = function () {
	this.totalTests = 0;
	this.passedTests = 0;
	this.failedTests = 0;
};

Suite.prototype.finishEvent = function () {
	if (this.passedTests + this.failedTests === this.totalTests) {
		this.log(
			"Ran"
			, this.totalTests
			, "tests."
			, this.passedTests
			, "passed, "
			, this.failedTests
			, "failed"
		);
		this.emit('finish');
	}
}

Suite.prototype.printCount = function () {
	this.log(
		"Ran"
		, this.totalTests
		, "tests."
		, this.passedTests
		, "passed, "
		, this.failedTests
		, "failed, "
		, this.totalTests - this.passedTests - this.failedTests
		, "running"
	);
};

Suite.prototype.onTestPassed = function (test, result) {
	this.passedTests++;
	if (this.verbose) {
		this.log('Test', test, 'passed');
		if (result) {
			this.log('\t' + result);
		}
	}
	this.finishEvent();
};

Suite.prototype.onTestFailed = function (test, error) {
	this.failedTests++;
	if (this.verbose) {
		this.log('Test', test, 'failed');
		this.log('\t' + error.message || error);
	}
	this.finishEvent();
};

module.exports = Suite;