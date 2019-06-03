module.exports = function linear(x, xgrid, ygrid) {
	if (xgrid.length !== ygrid.length)
		throw new Error('error in interpolate: xgrid and ygrid must have same length');
	var length = xgrid.length;
	
	var comparator = function(a,b) {
		if (xgrid[1] > xgrid[0])
			return (a >= b);
		else
			return (a <= b);
	};
	
	var i = xgrid.findIndex(v => comparator(v, x));
	
	//if x outside of xgrid's value range => return first/last entry from ygrid
	if (i==0)
		return ygrid[0];
	if (i==-1)
		return ygrid[length -1];
	
	//else interpolate
	var fraction = (x - xgrid[i-1]) / (xgrid[i] - xgrid[i-1]);
	return ygrid[i-1] + fraction * (ygrid[i] - ygrid[i-1]);
};