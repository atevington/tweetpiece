var environment = require("dotenv").config();
var middleware = require("./middleware");
var controllers = require("./controllers");
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

app.use(
	express.static("public")
);

app.post(
	"/screenshot/:tweetId",
	middleware.setHeader.bind(null, "Content-Type", "application/json"),
	controllers.screenshot
);

app.use(
	"*",
	middleware.setHeader.bind(null, "Content-Type", "application/json"),
	middleware.notFound
);

app.listen(port, function() {
	console.log("Listening on port " + port + ".");
});