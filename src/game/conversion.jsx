const React = require("react");

const PropConversion = require("propTypes/conversion");

module.exports = React.createClass({
    propTypes: {
        conversion: PropConversion.isRequired,
    },
    getInitialState: function() {
        return {};
    },
    render: function() {
    	let startMin = Math.floor(this.props.conversion.start / 60);
    	let startSec = this.props.conversion.start - startMin * 60;
    	if (startMin < 10)
    		startMin = "0" + startMin;
    	if (startSec < 10)
    		startSec = "0" + startSec;

		let endMin = Math.floor(this.props.conversion.end / 60);
    	let endSec = this.props.conversion.end - endMin * 60;
    	if (endMin < 10)
    		endMin = "0" + endMin;
    	if (endSec < 10)
    		endSec = "0" + endSec;

        return <div className="conversion">
        	<div className="time">
        		{ startMin }:{ startSec } - { endMin }:{ endSec }
        	</div>
            <div>
            	{ this.props.conversion.name ? 
            		this.props.conversion.name + " (" + this.props.conversion.championName + ")"
            	:
            		"Directed"
            	}
            </div>
            <div className="state">{ this.props.conversion.state }</div>
            { this.props.conversion.videoLink ?
                <a className="button" href={ this.props.conversion.videoLink } target="_blank">Watch</a>
            : null }
        </div>;
    }
});
