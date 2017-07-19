var React = require("react");
var ReactDOM = require("react-dom");
var Screenshot = require("./screenshot.jsx");
var Shop = require("./shop.jsx");

function getUrlParameterByName(name) {
	var regex = new RegExp("[?&]" + name.replace(/[\[\]]/g, "\\$&") + "(=([^&#]*)|&|#|$)")
	var results = regex.exec(window.location.href);
	
	if (!results) {
		return null;
	}

	if (!results[2]) {
		return "";	
	}
	
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var App = React.createClass({
	getInitialState: function() {
		return {
			url: "",
			imageLink: ""
		};
	},
	componentDidMount: function() {
		var _self = this;
		var defaultUrl = getUrlParameterByName("url");
		
		if (defaultUrl) {
			_self.setUrl(defaultUrl);
		}
	},
	isValidUrl: function(url) {
		return (
			/(https?:\/\/)(mobile\.)?(twitter\.com)\/[a-zA-Z0-9_]+\/(status)\/[0-9]+/i.test(url) ||
			/(https?:\/\/)(mobile\.)?(twitter\.com)\/(statuses)\/[0-9]+/i.test(url)			
		);
	},
	setUrl: function(rawUrl) {
		var _self = this;
		var url = (rawUrl || "").trim().split("#")[0].split("?")[0];

		if (url.substr(url.length - 1) === "/") {
			url = url.substr(0, url.length - 1);
		}
		
		_self.setState({
			url: url,
			imageLink: ""
		});
	},
	onUrlChange: function(evt) {
		var _self = this;
		
		_self.setUrl(evt.target.value);
	},
	onImageLoad: function(imageLink) {
		var _self = this;
		
		_self.setState({
			imageLink: imageLink
		});
	},
	onImageError: function() {
		alert("An unknown error has occurred.");
		
		_self.setState({
			url: "",
			imageLink: ""
		});
	},
	focusTextInput: function(textInput) {
		textInput.focus();
	},
	isImageLoading: function() {
		var _self = this;
		
		return !_self.state.imageLink && _self.isValidUrl(_self.state.url);
	},
	render: function() {
		var _self = this;

		return (
			<div>
				<div className="topPadding">
					<input
						type="text"
						placeholder="Paste tweet url here"
						onChange={_self.onUrlChange}
						ref={_self.focusTextInput}
						className={!_self.isValidUrl(_self.state.url) ? "invalid" : ""}
						readOnly={_self.isImageLoading()}
						value={_self.state.url}
					/>
				</div>
				{
					_self.state.imageLink ?
					<div className="topPadding fontSmall">
						<Shop
							imageLink={_self.state.imageLink}
						/>
					</div> :
					null
				}
				{
					_self.isValidUrl(_self.state.url) ?
					<div className="topPadding bottomPadding screenshot">
						<Screenshot
							url={_self.state.url}
							onImageLoad={_self.onImageLoad.bind(_self)}
							onImageError={_self.onImageError.bind(_self)}
						/>
					</div> :
					<div className="topPadding">
						<img src="images/tweet.png" />
					</div>
				}
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById("app"));