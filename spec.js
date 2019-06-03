var expect = require('chai').expect;
var helper = require("node-red-node-test-helper");
var linear = require("./linear.js");
var interpolate = require("./interpolate.js");

helper.init(require.resolve('node-red'));

const grid = {
	x: [0, 0.5, 1.5, 2],
	y: [2000, 1500, 500, 0]
};

const reverse = {
	x: [2, 1.5, 0.5, 0],
	y: [2000, 1500, 500, 0]
};

const precision = 0.001;


describe('linear interpolation', function () {

	it('should interpolate linearly', function () {
		expect(linear(0.5, grid.x, grid.y)).to.be.closeTo(1500, precision);
		expect(linear(0.1, grid.x, grid.y)).to.be.closeTo(1900, precision);
		expect(linear(1.99, grid.x, grid.y)).to.be.closeTo(10, precision);

		expect(linear(0.5, reverse.x, reverse.y)).to.be.closeTo(500, precision);
		expect(linear(0.1, reverse.x, reverse.y)).to.be.closeTo(100, precision);
		expect(linear(1.99, reverse.x, reverse.y)).to.be.closeTo(1990, precision);
	});

	it('should handle edge cases', function () {
		expect(linear(0, grid.x, grid.y)).to.be.closeTo(2000, precision);
		expect(linear(-0.1, grid.x, grid.y)).to.be.closeTo(2000, precision);
		expect(linear(2, grid.x, grid.y)).to.be.closeTo(0, precision);
		expect(linear(2.1, grid.x, grid.y)).to.be.closeTo(0, precision);

		expect(linear(0, reverse.x, reverse.y)).to.be.closeTo(0, precision);
		expect(linear(-0.1, reverse.x, reverse.y)).to.be.closeTo(0, precision);
		expect(linear(2, reverse.x, reverse.y)).to.be.closeTo(2000, precision);
		expect(linear(2.1, reverse.x, reverse.y)).to.be.closeTo(2000, precision);
	});
});

describe('interpolate Node', function () {

	const defaultFlow = [{
			id: "n1",
			type: "interpolate",
			name: "test name",
			wires: [["n2"]]
	},
		{
			id: "n2",
			type: "helper"
	}];

	let n1, n2;

	beforeEach(function (done) {
		helper.startServer(function () {
			helper.load(interpolate, defaultFlow, function () {
				n1 = helper.getNode("n1");
				n2 = helper.getNode("n2");
				done();
			});
		});
	});

	afterEach(function (done) {
		helper.unload();
		helper.stopServer(done);
	});

	it('should be loaded', function () {
		expect(n1.name).to.equal('test name');
	});

	it('should interpolate linearly', function (done) {
		n2.on("input", function (msg) {
			expect(msg.payload.x).to.be.closeTo(0.5, precision);
			expect(msg.payload.y).to.be.closeTo(1500, precision);
			done();
		});

		n1.receive({
			topic: 'datagrid',
			payload: grid
		});

		n1.receive({
			payload: {
				x: 0.5
			}
		});

	});

	it('should return error if no grid has been provided', function (done) {
		n2.on("input", function (msg) {
			expect(msg.payload).to.equal('No data available for interpolation');
			done();
		});

		n1.receive({
			payload: {
				x: 0.5
			}
		});

	});

	it('should return error if input has wrong format', function (done) {
		n2.on("input", function (msg) {
			expect(msg.payload).to.equal('No data available for interpolation');
			done();
		});

		n1.receive({
			topic: 'datagrid',
			payload: grid
		});

		n1.receive({
			payload: {
				someProperty: 'someValue'
			}
		});

	});
	
});
