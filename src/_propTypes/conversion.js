"use strict";

const React = require("react");

module.exports = React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    start: React.PropTypes.number.isRequired,
    end: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    state: React.PropTypes.string.isRequired,

    videoLink: React.PropTypes.string,
    championName: React.PropTypes.string,
});
