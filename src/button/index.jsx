const React = require("react");
const cx = require("classnames");

module.exports = React.createClass({
	propTypes: {		
		highlighted: React.PropTypes.bool,
		small: React.PropTypes.bool,
		disabled: React.PropTypes.bool
	},
    componentWillMount: function() {
        require("./style.scss");
    },
	render: function() {
		let className = cx("component-button", { highlighted: this.props.highlighted, small: this.props.small, disabled: this.props.disabled });
		return <div className={ className } onClick={ this.props.onClick }>
			{ this.props.children }
		</div>;
	}
});
