var snabbdom = require('../../snabbdom.js');
var patch = snabbdom.init([
    require('../../modules/class'),
    require('../../modules/hero'),
    require('../../modules/style'),
    require('../../modules/eventlisteners'),
]);
var h = require('../../h.js');

var vnode;