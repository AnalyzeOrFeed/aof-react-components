const React = require("react");

module.exports = React.createClass({
    componentWillMount: function() {
        require("./style.scss");
    },
	render: function() {
		return <div className="component-spinner">
			<div className="bounce1"></div>
			<div className="bounce2"></div>
			<div className="bounce3"></div>
        </div>;
	}
});
