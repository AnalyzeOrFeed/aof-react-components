var React = require("react");
var cx = require("classnames");

module.exports = React.createClass({
    prevent: false,
    propTypes: {
        show: React.PropTypes.bool.isRequired,
        onClose: React.PropTypes.func.isRequired,
    },
    componentWillMount: function() {
        require("./style.scss");
    },
    close: function() {
        if (this.prevent) {
            this.prevent = false;
            return;
        }
        this.props.onClose();
    },
    stopClose: function(event) {
       this.prevent = true;
    },
    render: function() {
        return <div className={ cx("component-modal", { visible: this.props.show }) } onClick={ this.close }>
            <div className="modal" onClick={ this.stopClose }>
                <div className="close pointer" onClick={ this.close }>&times;</div>
                { this.props.children }
            </div>
        </div>;
    }
});
