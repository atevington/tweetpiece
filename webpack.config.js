var webpack = require("webpack");
var path = require("path");

var clientFolder = path.resolve(__dirname, "client");
var publicFolder = path.resolve(path.resolve(__dirname, "public"), "scripts");

module.exports = {
	entry: {
		app: clientFolder + "/app.jsx"
	},
	output: {
		path: publicFolder,
		filename: "[name].js"
	},
	module: {
		loaders: [
			{
				test : /\.js?/,
				include : clientFolder,
				loader : "babel-loader"
			}
		]
	},
	plugins: []
};