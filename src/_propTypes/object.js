"use strict";

const React = require("react");

module.exports = React.PropTypes.shape({
	name: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.func,
	]).isRequired,
	image: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.func,
	]).isRequired,
});
