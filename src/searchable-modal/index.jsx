const React = require("react");
const ReactDOM = require("react-dom");
const _ = require("lodash");
const cx = require("classnames");

const api = require("./api");
const Result = require("./result");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			x: 0,
			y: 0,
			mouseX: 0,
			mouseY: 0,
			show: false,
			searchPredicate: "",

			source: null,
			dataset: null,
			searchBy: "name",
			imageBy: "name",
			showRemove: false,
			placeholder: null,
			callback: null,
		};
	},
    componentWillMount: function() {
        require("./style.scss");
    },
    componentDidMount: function() {
    	window.addEventListener("click", this.handleOutsideClick, false);
    	window.addEventListener("mousemove", this.handleMouseMove, false);
    	api.on("show", this.handleShow);
    },
    componentWillUnmount: function() {
    	window.removeEventListener("click", this.handleOutsideClick, false);
    	window.removeEventListener("mousemove", this.handleMouseMove, false);
    	api.off("show");
    },
	handleSearchChange: function(event) {
		this.setState({ searchPredicate: event.target.value.toLowerCase() });
	},
	handleSelect: function(item) {
		if (this.state.callback) this.state.callback(item);
		this.hide();
	},
	handleShow: function(source, dataset, searchBy, imageBy, showRemove, placeholder, callback) {
		this.setState({
			x: this.state.mouseX,
			y: this.state.mouseY,
			show: true,
			source: source,
			dataset: dataset,
			searchBy: searchBy,
			imageBy: imageBy,
			showRemove: showRemove,
			placeholder: placeholder,
			callback: callback,
			searchPredicate: "",
		});
	},
	handleOutsideClick: function(event) {
		if (!this.state.show) return;
		if (this.refs.main.contains(event.target)) return;
		if (this.state.source.contains(event.target)) return;
		this.hide();
	},
	handleMouseMove: function(event) {
		this.setState({
			mouseX: event.pageX,
			mouseY: event.pageY,
		});
	},
	hide: function() {
		this.setState({
			show: false,
		});
	},
	render: function() {
		// Filter results by search criteria
		let results = _.sortBy(_.filter(this.state.dataset, (item) => {
			let criteria = item[this.state.searchBy];
			if (typeof criteria === "function") criteria = criteria();

			return _.startsWith(_.toLower(criteria), this.state.searchPredicate);
		}), this.state.searchBy);
		let className = cx("component-searchableModal", { show: this.state.show });

		return <div ref="main" className={ className } style={{ left: this.state.x, top: this.state.y }}>
			<input
				type="text"
				value={ this.state.searchPredicate }
				onChange={ this.handleSearchChange } 
				placeholder={ this.state.placeholder || "Search..." }
			/>

			{ results.length ?
				<div className="results">
					{ this.state.showRemove ?
						<Result
							data={ null }
							image={ require("./assets/remove.svg") } 
							label="Remove"
							key={ -1 }
							onSelect={ this.handleSelect }
						/>
					: null }
					{ results.map((result, index) => {
						let label = result[this.state.searchBy];
						if (typeof label === "function") label = label.bind(result)();

						let image = this.state.imageBy ? result[this.state.imageBy] : null;
						if (typeof image === "function") image = image.bind(result)();

						return <Result
							data={ result }
							label={ label } 
							image={ image }
							key={ index }
							onSelect={ this.handleSelect }
						/>;
					}) }
				</div>
			:
				<div className="resultsEmptyState">
					No results.
				</div>
			}
		</div>;
	}
});
module.exports.api = api;
