var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/attributes').default
]);

var h = require('snabbdom/h').default;

var axis = require('../lib/cjs/index').default;
var scale = require('d3-scale');

var container = document.querySelector('.app');

var customScale = scale.scaleLinear()
    .domain([0, 200])
    .range([490, 10])

var axisGenerator = axis.axisLeft(customScale)
    .ticks(10);

var axisDOM = axisGenerator.call({ left: 10, bottom: 490, top: 10, right: 490 });

patch(container, h('div', {}, [h('svg', { attrs: {
    width: 500,
    height: 500,
    viewBox: "0 0 500 500"
}}, [axisDOM])]));
