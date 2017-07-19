module.exports = function(req, res, next) {
	res.status(404).send({error: "The requested resource was not found."});	
};