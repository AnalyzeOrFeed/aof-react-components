const React = require("react");
const cx = require("classnames");

module.exports = React.createClass({
	propTypes: {
		src: React.PropTypes.string.isRequired,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		
		highlighted: React.PropTypes.bool,
		disabled: React.PropTypes.bool
	},
    componentWillMount: function() {
        require("./style.scss");
    },
	render: function() {
		let className = cx("component-button-image", {
			highlighted: this.props.highlighted,
			disabled: this.props.disabled
		});

		return <div className={ className } onClick={ this.props.onClick }>
			<img src={ this.props.src } height={ this.props.height } width={ this.props.width } />
		</div>;
	}
});
