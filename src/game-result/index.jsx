const React  = require("react");
const moment = require("moment");
const _      = require("lodash");
const cx     = require("classnames");

const Button = require("../button");
const ObjectImage = require("../object-image");

const PropGame = require("propTypes/game");

if (navigator && navigator.language) moment.locale(navigator.language);

module.exports = React.createClass({
	propTypes: {
		game: PropGame.isRequired,
		player: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string,
		]).isRequired,
		link: React.PropTypes.string,
		linkText: React.PropTypes.string,
		onWatch: React.PropTypes.func,
		onLink: React.PropTypes.func,
	},
	componentWillMount: function() {
        require("./style.scss");
    },
    shouldComponentUpdate: function(nextProps, nextState) {
    	if (nextProps.game && !this.props.game) return true;
    	if (!nextProps.game && this.props.game) return true;
    	if (!nextProps.game && !this.props.game) return false;
    	return nextProps.game.regionId != this.props.game.regionId || 
    		nextProps.game.id != this.props.game.id || nextProps.player != this.props.player;
    },
    getInitialState: function() {
    	return {};
    },
    handleWatch: function() {
    	if (this.props.onWatch) this.props.onWatch(this.props.game);
    },
    handleLink: function() {
    	if (this.props.onLink) this.props.onLink(this.props.link);
    	else if (this.props.link) window.open(this.props.link, "_blank");
    },
	render: function() {
		let player = _.find(this.props.game.players, { id: this.props.player });
		if (!player) player = _.find(this.props.game.players, { playerNr: this.props.player });
		if (!player) player = _.find(this.props.game.players, { name: this.props.player });

		if (!player) return null;

		let result = "none";
		if (typeof this.props.game.winTeamNr != "undefined") {
			if (player.teamNr === this.props.game.winTeamNr) result = "won";
			else result = "lost";
		}

		let goldEarned = player.goldEarned;
		if (goldEarned >= 1000) {
			goldEarned /= Math.pow(10, 3);
			goldEarned = goldEarned.toFixed(1) + "K";
		}
		
		let secs = null;
		let mins = null;
		if (this.props.game.duration) {
			mins = Math.floor(this.props.game.duration / 60);
			secs = this.props.game.duration - mins * 60;
			if (secs < 10) secs = "0" + secs.toString();
		}

		return <div className="component-game-result">
			<div className="separator" />

			<div className={ cx("component-game-resultPlayer", result) }>
				<div className="championBlock">
					<div>
						<ObjectImage
							data={ player.champion }
							displayBy="name"
							imageBy="image"
							size={ 50 }
							crop={ 10 }
						/>
					</div>

					<div className="spellBlock">
						<div>
							<ObjectImage
								data={ player.spell1 }
								displayBy="name"
								imageBy="image"
								size={ 23 }
							/>
						</div>
						<div>
							<ObjectImage
								data={ player.spell2 }
								displayBy="name"
								imageBy="image"
								size={ 23 }
							/>
						</div>
					</div>
				</div>

				<div className="splitBlock">
					<div className="top">
						{ player.name }
					</div>
					<div className="bottom small">
						{ this.props.game.startTime > 0 ?
							moment(this.props.game.startTime).format("lll")
						: null }
					</div>
				</div>

				<div className="splitBlock">
					<div className="top small">
						 { this.props.game.region ? 
                            <div className="info">
                                <img src={ require("assets/globe.svg") } />
                                <div className="label">{ this.props.game.region }</div>
                            </div>
                        : null }
                        { this.props.game.version ? 
                            <div className="info">
                                <img src={ require("assets/disc.svg") } />
                                <div className="label">{ this.props.game.version }</div>
                            </div>
                        : null }
					</div>
					<div className="bottom">
						{ this.props.game.type ? 
                            <div className="info">
                                <img src={ require("assets/controller.svg") } />
                                <div className="label">{ this.props.game.type }</div>
                            </div>
                        : null }
					</div>
				</div>

				<div className="leagueBlock">
					{ player.league ? 
						<ObjectImage
							data={ player.league }
							displayBy="name"
							imageBy="image"
							size={ 40 }
						/>
					: null }
				</div>

				{ this.props.link ? 
					<Button onClick={ this.handleLink } small={ true }>
						{ this.props.linkText }
					</Button>
				: null }

				{ this.props.onWatch ? 
					<Button onClick={ this.handleWatch } highlighted={ true }>
						WATCH
					</Button>
				: null }
			</div>

			<div className="separator" />
		</div>;
	}
});
