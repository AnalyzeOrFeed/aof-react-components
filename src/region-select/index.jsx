const React = require("react");

module.exports = React.createClass({
    propTypes: {
        regions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        valueBy: React.PropTypes.string.isRequired,
        displayBy: React.PropTypes.string.isRequired,
        value: React.PropTypes.any,
        name: React.PropTypes.string,
        onChange: React.PropTypes.func,
    },
    componentWillMount: function() {
        require("./style.scss");
    },
    getInitialState: function() {
        return {
            value: this.props.value,
        };
    },
    handleChange: function(event) {
        this.setState({ value: event.target.value });
        if (this.props.onChange) this.props.onChange(event);
    },
	render: function() {
		return <div className="compontent-region-select">
            <select ref="select" name={ this.props.name } onChange={ this.handleChange } value={ this.state.value }>
                { this.props.regions.map((region, index) => {
                    let value = region[this.props.valueBy];
                    if (typeof value == "function") value = value.bind(region)();

                    let name = region[this.props.displayBy];
                    if (typeof name == "function") name = name.bind(region)();

                    return <option value={ value } key={ index }>{ name }</option>;
                }) }
            </select>
        </div>;
	}
});
