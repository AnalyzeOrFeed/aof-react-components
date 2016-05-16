const React = require("react");
const cx = require("classnames");

module.exports = React.createClass({
    prevent: false,
    propTypes: {
        getResults: React.PropTypes.func.isRequired,

        onChange: React.PropTypes.func,
        onEnter: React.PropTypes.func,
        value: React.PropTypes.string,
        name: React.PropTypes.string,
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
    setValue: function(value) {
        this.setState({
            results: [],
            searchTerm: value,
            selected: -1,
        });

        this.prevent = true;
        
        let event = new Event("input", { bubbles: true, cancelable: true });
        this.refs.text.dispatchEvent(event);
    },
    handleClick: function(event) {
        if (this.prevent) {
            this.prevent = false;
            return;
        }

        this.props.getResults(this.state.searchTerm, results => this.setState({ results: results }));
        this.prevent = true;
    },
    handleOutsideClick: function(event) {
        if (this.prevent) {
            this.prevent = false;
            return;
        }
        this.setState({ results: [] });
    },
    handleChange: function(event) {
        if (this.props.onChange) this.props.onChange(event);

        // If prevent is true then it was a "fake" event from this.setValue, so we can exit here
        if (this.prevent) return;

        this.setState({
            searchTerm: event.target.value,
            selected: -1,
        });

        this.props.getResults(event.target.value, results => this.setState({ results: results }));
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
			<input ref="text" type="text" name={ this.props.name } value={ this.state.searchTerm } onChange={ this.handleChange } 
                onKeyDown={ this.handleKeyPress } placeholder={ this.props.placeholder } />
            
            { this.state.results && this.state.results.length ?
                <div className="results">
                    { this.state.results.map((result, index) => {
                        let className = cx("result", { selected: index == this.state.selected });
                        return <div key={ index } className={ className } onClick={ () => this.setValue(result) }>
                            <pre>{ result }</pre>
                        </div>;
                    }) }
                </div>
            : null }
		</div>;
	}
});
