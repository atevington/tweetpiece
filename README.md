## Intro
This project allows a user to take a screenshot of a tweet and print it on various items with [Zazzle](https://www.zazzle.com/). The back-end is in [Node.js](https://nodejs.org/) using the [Express](https://www.npmjs.com/package/express) framework, while the front-end is written in [React](https://www.npmjs.com/package/react).

## Process

* A screenshot is taken via [nightmare](https://www.npmjs.com/package/nightmare) and cropped with [jimp](https://www.npmjs.com/package/jimp)
* The screenshot is uploaded to [Imgur](https://imgur.com/)
* The user is redirected to Zazzle with the image URL from the above step in the query string
* Zazzle shows the screenshot superimposed on various products, which the user can purchase and further customize

## Setup
* Download and install [Node.js](https://nodejs.org/)
* Open a command line and navigate to the base folder of the repository
* Run `npm install` to get all required dependencies

## Local Dev
* Run `npm run build` to compile and bundle the client-side code
* Run `node index.js` to launch the server

## Thanks
Most of the code to take a screenshot comes from [screenshot-tweet](https://www.npmjs.com/package/screenshot-tweet). I made the following adjustments:

* Pulled the main code out of the CLI and into a function
* Modified the code so that sensitive material in a tweet is always displayed
* Implemented a check so that if the size of the tweet is larger than the viewport of the headless browser, it's scaled down via css to fit the viewport (images were otherwise distorted)