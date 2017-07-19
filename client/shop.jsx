var React = require("react");
var ReactDOM = require("react-dom");
var zazzle = require("../zazzle");

module.exports = React.createClass({
	getProductUrl: function(templateId) {
		var _self = this;
		
		return (
			"https://www.zazzle.com/api/create/at-" +
			encodeURIComponent(zazzle.associateId) + "?rf=" + encodeURIComponent(zazzle.associateId) + "&ax=Linkover&pd=" + 
			encodeURIComponent(templateId) + "&ed=true&tc=&ic=&" + encodeURIComponent(zazzle.urlParam) + "=" + encodeURIComponent(_self.props.imageLink)
		);
	},
	render: function() {
		var _self = this;
		
		var productSelections = zazzle.products.map(function(product, index) {
			return (
				<span key={product.templateId}>
					<a
						target="_blank"
						href={_self.getProductUrl(product.templateId)}
						dangerouslySetInnerHTML={{__html: product.description + " &#8599;"}}
					/>
					<span dangerouslySetInnerHTML={{__html: index + 1 !== zazzle.products.length ? "&nbsp;&#8226;&nbsp;" : ""}} />
				</span>
			);
		});

		return <div><strong>Print on:</strong> {productSelections}</div>;
	}
});