"use strict";

const React = require("react");

const obj = require("./object");

module.exports = React.PropTypes.shape({
	name: React.PropTypes.string.isRequired,
	teamNr: React.PropTypes.number.isRequired,

	id: React.PropTypes.number,
	champion: obj,
	league: obj,
	spell1: obj,
	spell2: obj,
	kills: React.PropTypes.number,
	deaths: React.PropTypes.number,
	assists: React.PropTypes.number,
	goldEarned: React.PropTypes.number,
	minionsKilled: React.PropTypes.number,

	items: React.PropTypes.arrayOf(obj),
	pesId: React.PropTypes.number,
});
