var Nightmare = require("nightmare");
var jimp = require("jimp");
var imgur = require("imgur");

// Adapted from https://www.npmjs.com/package/screenshot-tweet
function getScreenshot(tweetId, callback) {
	var tweetSelector = ".tweet[data-tweet-id=\"" + tweetId + "\"]";
	var nightmare = new Nightmare();

	Promise.resolve().then(function() {
		return nightmare.viewport(2000, 2000);
	}).then(function() {
		return nightmare.goto("https://twitter.com/statuses/" + tweetId);
	}).then(function() {
		return nightmare.wait(tweetSelector);
	}).then(function() {
		return nightmare.evaluate(function(tweetSelector) {
			var sensitiveButton = document.querySelector(tweetSelector + " .Tombstone button");
			
			if (sensitiveButton) {
				sensitiveButton.click();
			}
		}, tweetSelector);
	}).then(function() {
		return nightmare.wait(750);
	}).then(function() {
		return nightmare.evaluate(function(tweetSelector) {
			var elem = document.querySelector(tweetSelector);
			var rect = elem.getBoundingClientRect();

			if (rect.top + rect.height > window.innerHeight) {
				elem.style.transform = "scale(" + (window.innerHeight / (rect.top + rect.height)) + ")";
				elem.scrollIntoView();
			}
		}, tweetSelector);
	}).then(function() {
		return nightmare.wait(750);
	}).then(function() {
		return nightmare.evaluate(function(tweetSelector) {
			var rectangle = document.querySelector(tweetSelector).getBoundingClientRect();
			
			return {
				x: Math.round(rectangle.left),
				y: Math.round(rectangle.top),
				width: Math.round(rectangle.width),
				height: Math.round(rectangle.height)
			};
		}, tweetSelector);
	}).then(function(rectangle) {
		return nightmare.screenshot(rectangle);
	}).then(function(imageBuffer) {
		nightmare.end().then(function() {
			callback(imageBuffer);
		});
	}).catch(function() {
		nightmare.end().then(function() {
			callback(null);
		});
	});
}

function cropScreenshot(imageBuffer, callback) {
	var cropEdges = 10;
	
	jimp.read(imageBuffer, function(error, screenshot) {
		screenshot
			.crop(cropEdges, cropEdges, screenshot.bitmap.width - (cropEdges * 2), screenshot.bitmap.height - (cropEdges * 2))
			.getBase64(jimp.MIME_PNG, function(error, imageData) {
				callback(imageData.split("data:image/png;base64,")[1]);
			});
	});
}

function uploadImage(imageData, callback) {
	imgur.uploadBase64(imageData)
		.then(function(response) {
			callback(response.data.link);
		})
		.catch(function() {
			callback(null);
		});
}

module.exports = function(req, res, next) {
	getScreenshot(req.params.tweetId, function(imageBuffer) {
		if (imageBuffer) {
			cropScreenshot(imageBuffer, function(imageData) {
				uploadImage(imageData, function(imageLink) {
					if (imageLink) {
						res.send({link: imageLink});
					} else {
						next();
					}
				});
			});
		} else {
			next();
		}
	});
};