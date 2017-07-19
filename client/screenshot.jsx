var React = require("react");
var ReactDOM = require("react-dom");
var $ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			imageLink: "",
			isLoading: false
		};
	},
	componentDidMount: function() {
		var _self = this;
		_self.requestImageLink(_self.props.url);
	},
	componentWillReceiveProps: function(nextProps) {
		var _self = this;
		
		if (_self.props.url !== nextProps.url) {
			_self.requestImageLink(nextProps.url);
		}
	},
	parseUrl: function(url) {
		var chunks = url.split("/");
		return {tweetId: chunks[chunks.length - 1]};
	},
	requestImageLink: function(url) {
		var _self = this;
		
		_self.setState({
			imageLink: "",
			isLoading: true
		});

		$.post("/screenshot/" + _self.parseUrl(url).tweetId)
			.then(function(response) {
				if (_self.props.onImageLoad) {
					_self.props.onImageLoad(response.link);
				}
				
				_self.setState({
					imageLink: response.link,
					isLoading: false
				});
			})
			.catch(function() {
				_self.setState({
					imageLink: "",
					isLoading: false
				});
				
				if (_self.props.onImageError) {
					_self.props.onImageError();
				}
			});
	},
	render: function() {
		var _self = this;
		
		if (_self.state.isLoading) {
			return <img src="images/loading-icon.gif" />;
		}
		
		if (_self.state.imageLink) {
			return <img src={_self.state.imageLink} />;
		}

		return null;
	}
});