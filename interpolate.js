const linear = require("./linear.js");

module.exports = function (RED) {

	function Interpolate(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		
		var context = {
			get: (s) => node.context().get(s, config.storename),
			set: (s, v) => node.context().set(s, v, config.storename),
		};
			
		node.on("input", function (msg) {
			
			if (msg.topic === 'datagrid') {
				context.set('xgrid', msg.payload.x);
				context.set('ygrid', msg.payload.y);
				return;
			}
			
			var xgrid = context.get("xgrid");
			var ygrid = context.get("ygrid");
			
			var x = msg.payload.x;
			
			if (typeof xgrid === 'undefined' || typeof ygrid === 'undefined' || typeof x === 'undefined') {
				var errorString = 'No data available for interpolation';
				node.warn(errorString);
				msg.payload = errorString;
				node.send(msg);
				return;
			}
			
			msg.payload = {
				x: x,
				y: linear(x, xgrid, ygrid)
			};
			node.send(msg);	
		});
	}

	RED.nodes.registerType("interpolate", Interpolate);
};