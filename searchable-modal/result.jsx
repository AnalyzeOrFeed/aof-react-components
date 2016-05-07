const React = require('react');

module.exports = React.createClass({
	propTypes: {
		onSelect: React.PropTypes.func.isRequired,

		data: React.PropTypes.any,
		image: React.PropTypes.string,
		label: React.PropTypes.string
	},
	handleClick: function() {
		this.props.onSelect(this.props.data);
	},
	render: function() {
		return <div className="result" onClick={ this.handleClick }>
			{ this.props.image ? <img src={ this.props.image } /> : null }
			{ this.props.label ? <div className="label">{ this.props.label }</div> : null }
		</div>;
	}
});
