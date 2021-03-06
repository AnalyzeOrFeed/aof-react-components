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
    shouldComponentUpdate: function(nextProps, nextState) {
    	if (this.props.size != nextProps.size) return true;
    	if (this.props.crop != nextProps.crop) return true;
    	if (this.props.round != nextProps.round) return true;

    	if (nextProps.data && !this.props.data) return true;
    	if (!nextProps.data && this.props.data) return true;
    	if (nextState.data && !this.state.data) return true;
    	if (!nextState.data && this.state.data) return true;
    	if (!nextProps.data && !this.props.data && !nextState.data && !this.state.data) return false;

		let image = this.state.data[this.props.imageBy];
		let newImage = nextState.data[nextProps.imageBy];
		if (typeof image === "function") image = image.bind(this.state.data)();
		if (typeof newImage === "function") newImage = newImage.bind(this.state.data)();
		if (image != newImage) return true;

    	return false;
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
		
		let crop = "100% 100%";
		if (this.props.crop >= 0) crop = (100 + this.props.crop) + "% " + (100 + this.props.crop) + "%";

		let style = {
			width: (size - (this.state.data ? 0 : 2)) + "px",
			height: (size - (this.state.data ? 0 : 2)) + "px",
			cursor: (this.props.dataset ? "pointer" : "default"),
			backgroundImage: this.state.data ? "url(" + image + ")" : null,
			backgroundSize: crop,
		};

		let className = cx("component-object-image", {
			changeable: this.props.dataset,
			populated: this.state.data,
			round: this.props.round,
		}, this.props.className);

		return <div className={ className } style={ style } ref="main" onClick={ this.handleClick } 
				onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave }>
		</div>;
	}
});
