const React = require("react");
const cx = require("classnames");

const TooltipApi = require("../tooltip").api;
const SearchableApi = require("../searchable-modal").api;

module.exports = React.createClass({
	propTypes: {
		displayBy: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]).isRequired,
		imageBy: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]).isRequired,

		size: React.PropTypes.number,
		crop: React.PropTypes.number,
		round: React.PropTypes.bool,

		data: React.PropTypes.object,
		dataset: React.PropTypes.arrayOf(React.PropTypes.object),
		default: React.PropTypes.string,
		onDataChange: React.PropTypes.func,
	},
    componentWillMount: function() {
        require("./style.scss");
    },
    componentWillReceiveProps: function(nextProps) {
    	this.setState({
    		data: nextProps.data
    	});
    },
    getInitialState: function() {
    	return {
    		data: this.props.data,
    	};
    },
    handleClick: function(event) {
    	if (!this.props.dataset) return;
		SearchableApi.show(this.refs.main, this.props.dataset, this.props.displayBy, 
			this.props.imageBy, this.state.data ? true : false, this.props.default, (item) => {

			if (this.props.onDataChange) this.props.onDataChange(item);
			this.setState({
				data: item,
			});
		});
    },
	handleMouseEnter: function() {
		if (!this.state.data && !this.props.default) return;

		let name = null;
		if (this.state.data) {
			name = this.state.data[this.props.displayBy];
			if (typeof name === "function") name = name.bind(this.state.data)();
		}

		TooltipApi.showTooltip(name || this.props.default);
	},
	handleMouseLeave: function() {
		if (!this.state.data && !this.props.default) return;
		TooltipApi.hideTooltip();
	},
	render: function() {
		let name = null;
		let image = null;

		if (this.state.data) {
			name = this.state.data[this.props.displayBy];
			if (typeof name === "function") name = name.bind(this.state.data)();

			image = this.state.data[this.props.imageBy];
			if (typeof image === "function") image = image.bind(this.state.data)();
		}

		let size = 50;
		if (this.props.size >= 0) size = this.props.size;
		
		let crop = 12;
		if (this.props.crop >= 0) crop = this.props.crop;

		let style = {
			width: (size - (this.state.data ? 0 : 2)) + "px",
			height: (size - (this.state.data ? 0 : 2)) + "px",
			cursor: (this.props.dataset ? "pointer" : "default")
		};

		let imgStyle = {
			top: (-crop / 2) + "px",
			left: (-crop / 2) + "px",
			width: (size + crop) + "px",
			height: (size + crop) + "px",
		};

		let className = cx("component-object-image", {
			changeable: this.props.dataset,
			populated: this.state.data,
			round: this.props.round,
		}, this.props.className);

		return <div className={ className } ref="main">
			<div style={ style } onClick={ this.handleClick } onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave }>
				{ this.state.data ?
					<img src={ image } style={ imgStyle } />
				: null }
			</div>
		</div>;
	}
});
