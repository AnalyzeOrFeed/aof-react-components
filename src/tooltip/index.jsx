const React = require("react");
const cx    = require("classnames");

const api = require("./api");

module.exports = React.createClass({
	componentWillMount: function() {
		require("./style.scss");
	},
	componentDidMount: function() {
		api.on("show", this.toggleTooltip);
		api.on("hide", this.toggleTooltip);
		window.addEventListener("mousemove", this.mouseMove, false);
	},
	componentWillUnmount: function() {
		api.off("show", this.toggleTooltip);
		api.off("hide", this.toggleTooltip);
		window.removeEventListener("mousemove", this.mouseMove, false);
	},
	getInitialState: function() {
		return {
			x: 0,
			y: 0,
			text: api.text,
		};
	},
	toggleTooltip: function(text) {
		this.setState({
			text: text,
		});
	},
	mouseMove: function(event) {
		this.setState({
			x: event.clientX,
			y: event.clientY + 20,
		});
	},
	render: function() {
		return <div className={ cx("component-tooltip", { show: this.state.text }) } style={{ left: this.state.x, top: this.state.y }}>
			{ this.state.text }
		</div>
	},
});
module.exports.api = api;
