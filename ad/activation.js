'use strict';

var Tensor = require('../tensor.js');
var THTensor = require('../THTensor.js');
var lift = require('../nn/lifting.js').lift;
var func = require('./func.js');

// The 'lifted' module already defines sigmoid and tanh.


var relu = lift(func.newUnaryFunction({
	OutputType: THTensor,
	name: 'relu',
	forward: function(t) {
        return t.relu();
    },
	// function(x) {
	// 	x = ad.value(x);
	// 	var y = x.clone();
	// 	var n = x.length;
	// 	while (n--) {
	// 		y.data[n] = y.data[n] < 0 ? 0 : y.data[n];
	// 	}
	// 	return y;
	// },
	backward: function(x) {
		var n = x.x.length;
		while (n--) {
			x.dx.data[n] += x.x.data[n] <= 0 ? 0 : this.dx.data[n];
		}
	}
}), 'relu');


// Sigmoid, shifted and scaled to the range (-1, 1)
// Same output range as tanh, but numerically stable (i.e. doesn't give NaNs
//    for large inputs).
var sigmoidCentered = lift(function(x) {
	return ad.tensor.sub(ad.tensor.mul(ad.tensor.sigmoid(x), 2), 1);
});


module.exports = {
	relu: relu,
	sigmoidCentered: sigmoidCentered
};