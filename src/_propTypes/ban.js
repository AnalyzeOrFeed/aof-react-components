"use strict";

const React = require("react");

const obj = require("./object");

module.exports = React.PropTypes.shape({
	banNr: React.PropTypes.number.isRequired,
	teamNr: React.PropTypes.number.isRequired,
	champion: obj,
});
