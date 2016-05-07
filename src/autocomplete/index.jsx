const React = require("react");
const cx = require("classnames");

module.exports = React.createClass({
    propTypes: {
        getResults: React.PropTypes.func.isRequired,

        onChange: React.PropTypes.func,
        onEnter: React.PropTypes.func,
        value: React.PropTypes.string,
        placeholder: React.PropTypes.string,
    },
    componentWillMount: function() {
        require("./style.scss");
    },
    componentDidMount: function() {
        document.addEventListener("click", this.handleOutsideClick, false);
    },
    componentWillUnmount: function() {
        document.removeEventListener("click", this.handleOutsideClick, false);
    },
    getInitialState: function() {
        return {
            searchTerm: this.props.value || "",
            results: [],
            selected: -1,
        };
    },
    setValue: function(event, value) {
        if (this.props.onChange) this.props.onChange(value);
        this.setState({
            results: [],
            searchTerm: value,
            selected: -1,
        });
        event.preventDefault();
    },
    handleClick: function(event) {
        if (event.defaultPrevented) return;
        this.props.getResults(this.state.searchTerm, (results) => this.setState({ results: results }));
        event.preventDefault();
    },
    handleOutsideClick: function(event) {
        if (event.defaultPrevented) return;
        this.setState({ results: [] });
    },
    handleUpdate: function(event) {
        this.setState({
            searchTerm: event.target.value,
            selected: -1,
        });

        if (this.props.onChange) this.props.onChange(event.target.value);        

        this.props.getResults(event.target.value, (results) => this.setState({ results: results }));
    },
    handleKeyPress: function(event) {
        if (event.keyCode === 13) {
            if (this.state.selected >= 0) {
                this.setValue(this.state.results[this.state.selected]);
            } else if (this.props.onEnter) {
                this.props.onEnter();
            }
        } else if (event.keyCode === 40 && this.state.results.length > 0) {
            this.setState({
                selected: this.state.selected >= 0 && this.state.selected < this.state.results.length - 1 ? this.state.selected + 1 : 0
            });
            event.preventDefault();
        } else if (event.keyCode === 38 && this.state.results.length > 0) {
            this.setState({
                selected: this.state.selected > 0 ? this.state.selected - 1 : -1
            });
            event.preventDefault();
        }
    },
	render: function() {
		return <div className="component-autocomplete" onClick={ this.handleClick }>
			<input type="text" value={ this.state.searchTerm } onChange={ this.handleUpdate } onKeyDown={ this.handleKeyPress }
                placeholder={ this.props.placeholder } />
            
            { this.state.results && this.state.results.length ?
                <div className="results">
                    { this.state.results.map((result, index) => {
                        let className = cx("result", { selected: index == this.state.selected });
                        return <div key={ index } className={ className } onClick={ (event) => this.setValue(event, result) }>
                            <pre>{result}</pre>
                        </div>;
                    }) }
                </div>
            : null }
		</div>;
	}
});
