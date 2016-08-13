const React = require("react");

const obj = React.PropTypes.shape({
	name: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.func,
	]).isRequired,
	image: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.func,
	]).isRequired,
});

const ban = React.PropTypes.shape({
	banNr: React.PropTypes.number.isRequired,
	teamNr: React.PropTypes.number.isRequired,
	champion: obj,
});

const conversion = React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,

    videoLink: React.PropTypes.string,
    championName: React.PropTypes.string,
});

const player = React.PropTypes.shape({
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

module.exports = {
	object: obj,
	ban: ban,
	conversion: conversion,
	game: React.PropTypes.shape({
		region: React.PropTypes.string,
		type: React.PropTypes.string,
		version: React.PropTypes.string,
		duration: React.PropTypes.number,
		winTeamNr: React.PropTypes.number,
		hasEndgameStats: React.PropTypes.bool,
		players: React.PropTypes.arrayOf(player),
		bans: React.PropTypes.arrayOf(ban),
		conversions: React.PropTypes.arrayOf(conversion),
	}),
	player: player,
};
