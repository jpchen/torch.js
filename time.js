var Tensor = require('adnn/tensor');
var ad = require('adnn/ad');
var nn = require('adnn/nn');
var opt = require('adnn/opt');

var nInputs = 20;
var nHidden = 10;
var nClasses = 5;

console.time('someFunction');
// Definition using basic layers
var net = nn.sequence([
  nn.linear(nInputs, nHidden),
  nn.tanh,
  nn.linear(nHidden, nClasses),
  nn.softmax
]);

// Alternate definition using 'nn.mlp' utility
net = nn.sequence([
  nn.mlp(nInputs, [
    {nOut: nHidden, activation: nn.tanh},
    {nOut: nClasses}
  ]),
  nn.softmax
]);
console.timeEnd('someFunction');
