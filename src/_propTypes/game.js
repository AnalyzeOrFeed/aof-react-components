"use strict";

const React = require("react");

const player = require("./player");
const ban = require("./ban");
const conversion = require("./conversion");

module.exports = React.PropTypes.shape({
	region: React.PropTypes.string,
	type: React.PropTypes.string,
	version: React.PropTypes.string,
	duration: React.PropTypes.number,
	winTeamNr: React.PropTypes.number,
	hasEndgameStats: React.PropTypes.bool,
	players: React.PropTypes.arrayOf(player),
	bans: React.PropTypes.arrayOf(ban),
	conversions: React.PropTypes.arrayOf(conversion),
});
