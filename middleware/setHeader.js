module.exports = function(header, val, req, res, next) {
	res.set(header, val);
	next();
};