const React  = require("react");
const moment = require("moment");
const _      = require("lodash");

const Button = require("../button");
const ObjectImage = require("../object-image");

const PropTypes = require("./propTypes");
const Player = require("./player");
const Conversion = require("./conversion");

if (navigator && navigator.language) moment.locale(navigator.language);

module.exports = React.createClass({
	propTypes: {
		game: React.PropTypes.shape({
			region: React.PropTypes.string,
			type: React.PropTypes.string,
			version: React.PropTypes.string,
			duration: React.PropTypes.number,
			winTeamNr: React.PropTypes.number,
			hasEndgameStats: React.PropTypes.bool,
			players: React.PropTypes.arrayOf(PropTypes.player),
			bans: React.PropTypes.arrayOf(React.PropTypes.shape({
				banNr: React.PropTypes.number.isRequired,
				teamNr: React.PropTypes.number.isRequired,
				champion: PropTypes.object,
			})),
			conversions: React.PropTypes.arrayOf(PropTypes.conversion),
		}).isRequired,
		link: React.PropTypes.string,
		linkText: React.PropTypes.string,
		showConversions: React.PropTypes.bool,
		conversionTimeLeft: React.PropTypes.number,
		onWatch: React.PropTypes.func,
		onNewConversion: React.PropTypes.func,
	},
	componentWillMount: function() {
        require("./style.scss");
    },
    getInitialState: function() {
    	return {
            newConversionStart: 0,
            newConversionEnd: this.props.game.duration,
            newConversionPlayer: "",
            newConversionUI: "",
            newConversionNames: true,
            newConversionFogOfWar: "All",
            newConversionScale: 100
        };
    },
    addNewConversion: function() {
        if (!this.props.onNewConversion) return;

        let player = this.state.newConversionPlayer;
        if (player == "")
            player = null;
        let uiScale = parseFloat(this.state.newConversionScale) / 100.0;

        this.props.onNewConversion(
            this.props.game.regionId,
            this.props.game.id,
            this.state.newConversionStart, 
            this.state.newConversionEnd,
            player,
            this.state.newConversionUI.split(","),
            uiScale, 
            this.state.newConversionNames == "true",
            this.state.newConversionFogOfWar
        );
    },
    handleChange: function(event) {
        this.setState({ [event.target.name]: event.target.value });
    },
    handleWatch: function() {
    	if (this.props.onWatch) this.props.onWatch(this.props.game);
    },
    handleLink: function() {
    	if (this.props.link) window.open(this.props.link, "_blank");
    },
	render: function() {
		let team1 = [];
		let team2 = [];

		_.each(this.props.game.players, (player) => {
			if (player.teamNr === 0) team1.push(player);
			else if (player.teamNr === 1) team2.push(player);
		});

		let team1Bans = [];
		let team2Bans = [];
		
		_.each(this.props.game.bans, (ban) => {
			if (ban.teamNr === 0) team1Bans.push(ban);
			else if (ban.teamNr === 1) team2Bans.push(ban);
		});

		let sortPlayers = (a, b) => (a.laneId - b.laneId) || (a.roleId - b.roleId);
		team1.sort(sortPlayers);
		team2.sort(sortPlayers);
		
		let team1Kills = _.reduce(team1, (memo, player) => memo + player.kills, 0);
		let team1Deaths = _.reduce(team1, (memo, player) => memo + player.deaths, 0);
		let team1Assists = _.reduce(team1, (memo, player) => memo + player.assists, 0);
		
		let team2Kills = _.reduce(team2, (memo, player) => memo + player.kills, 0);
		let team2Deaths = _.reduce(team2, (memo, player) => memo + player.deaths, 0);
		let team2Assists = _.reduce(team2, (memo, player) => memo + player.assists, 0);
		
		let secs = null;
		let mins = null;
		if (this.props.game.duration) {
			mins = Math.floor(this.props.game.duration / 60);
			secs = this.props.game.duration - mins * 60;
			if (secs < 10) secs = "0" + secs.toString();
		}

		let timeOptions = [];
        for (let i = 5; i < this.props.game.duration; i += 5) {
            let min = Math.floor(i / 60);
            let sec = i - min * 60;
            if (min < 10)
                min = "0" + min;
            if (sec < 10)
                sec = "0" + sec;
            timeOptions.push(<option value={ i } key={ i }>{ min }:{ sec }</option>);
        }

        let scaleOptions = [];
        for (let i = 100; i >= 0; i -= 5) {
            scaleOptions.push(<option value={ i } key={ i }>{ i }%</option>);
        }

        let timeLeft = null;
        if (this.props.conversionTimeLeft) {
        	let mins = Math.floor(this.props.conversionTimeLeft / 60);
        	let secs = this.props.conversionTimeLeft - mins * 60;
        	let hours = Math.floor(mins / 60);
        	mins = mins - hours * 60;
        	timeLeft = (hours > 0 ? hours + " hours " : "") + (mins > 0 ? mins + " minutes " : "") + secs + " seconds";
        }

		return <div className="component-game">
			<div className="header">
				<div className="date">
					{ this.props.game.startTime > 0 ?
						moment(this.props.game.startTime).format("LLL")
					: null }
				</div>

				<div className="info">
					{ this.props.game.region ? 
						<div>
							<img src={ require("./assets/globe.svg") } />
							<div className="label">{ this.props.game.region }</div>
						</div>
					: null }
					{ this.props.game.type ? 
						<div>
							<img src={ require("./assets/controller.svg") } />
							<div className="label">{ this.props.game.type }</div>
						</div>
					: null }
					{ this.props.game.version ? 
						<div>
							<img src={ require("./assets/disc.svg") } />
							<div className="label">{ this.props.game.version }</div>
						</div>
					: null }
					{ secs !== null ? 
						<div>
							<img src={ require("./assets/stopwatch.svg") } />
							<div className="label">{ mins + ":" + secs }</div>
						</div>
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

			<div className="cols">
				<div className="leftCol">
					{ team1.map(player => {
						return <Player
							player={ player }
							key={ player.name }
						/>
					}) }
				</div>

				<div className="rightCol">
					{ team2.map(player => {
						return <Player
							player={ player }
							key={ player.name }
						/>
					}) }
				</div>
			</div>
			
			<div className="separator" />

			<div className="cols">
				<div className="leftCol">
					<div className="totalStats">
						<div className="bans">
							{ team1Bans.map(ban => {
								return <ObjectImage
									className="ban"
									data={ ban.champion }
									displayBy="name"
									imageBy="image"
									key={ ban.banNr }
								/>
							})}
						</div>

						<div className="winner">
							{ this.props.game.winTeamNr === 0 ? "Winner" : null }
						</div>

						<div className="score">
							<div className="tiny">TOTAL</div>
							{ team1Kills >= 0 ? 
								<div>{ team1Kills } / { team1Deaths } / { team1Assists }</div>
							:
								<div>?</div>
							}
						</div>
					</div>
				</div>

				<div className="rightCol">
					<div className="totalStats">
						<div className="bans">
							{ team2Bans.map(ban => {
								return <ObjectImage
									className="ban"
									data={ ban.champion }
									displayBy="name"
									imageBy="image"
									key={ ban.banNr }
								/>
							})}
						</div>
						
						<div className="winner">
							{ this.props.game.winTeamNr === 1 ? "Winner" : null }
						</div>

						<div className="score">
							<div className="tiny">TOTAL</div>
							{ team2Kills >= 0 ? 
								<div>{ team2Kills } / { team2Deaths } / { team2Assists }</div>
							:
								<div>?</div>
							}
						</div>
					</div>
				</div>
			</div>

			<div className="separator" />

			{ !this.props.game.hasEndgameStats ? [
				<span className="noEndgameStats" key={ "stats" }>
					No endgame stats available
				</span>,
				<div className="separator" key={ "separator" } />
			] : null }

			{ this.props.showConversions ? [
				<div className="component-conversions" key="conversions">
		            <h2>Videos</h2>
		            { this.props.game.conversions.map((conversion) => 
		            	<Conversion conversion={ conversion } key={ conversion.id } />
		            ) }

		            <h3>New Video</h3>
		            <div className="conversion">
		                <div className="setting">
		                    <span>Time: </span>
		                    <select name="newConversionStart" onChange={ this.handleChange }>
		                        <option value={ 0 }>Start</option>
		                        { timeOptions }
		                    </select> -&nbsp;
		                    <select name="newConversionEnd" onChange={ this.handleChange }>
		                        <option value={ this.props.game.duration }>End</option>
		                        { timeOptions }
		                    </select>
		                </div>

		                <div className="setting">
		                    <span>Camera: </span>
		                    <select name="newConversionPlayer" onChange={ this.handleChange }>
		                        <option value="">&lt;Directed&gt;</option>
		                        { this.props.game.players.map(function(player) {
		                            return <option value={ player.playerNr } key={ player.playerNr }>
		                                { player.name } ({ player.champion.name })
		                            </option>;
		                        })}
		                    </select>
		                </div>

		                <div className="setting">
		                    <span>UI: </span>
		                    <select name="newConversionUI" onChange={ this.handleChange }>
		                        <option value="">Complete</option>
		                        <option value={ ["scoreDisplay", "blueTeamFrames", "redTeamFrames", "chat"] }>Partial</option>
		                    </select>
		                    &nbsp;@&nbsp;
		                    <select name="newConversionScale" onChange={ this.handleChange }>
		                        { scaleOptions }
		                    </select>
		                </div>

		                <div className="setting">
		                    <span>Names: </span>
		                    <select name="newConversionNames" onChange={ this.handleChange }>
		                        <option value={ true }>On</option>
		                        <option value={ false }>Off</option>
		                    </select>
		                </div>

		                <div className="setting">
		                    <span>Fog of War: </span>
		                    <select name="newConversionFogOfWar" onChange={ this.handleChange }>
		                        <option value={ "All" }>All</option>
		                        <option value={ this.state.newConversionPlayer < 5 ? "Blue" : "Red" }>
		                            { this.state.newConversionPlayer == "" ? "Blue Team" : "Spectating" }
		                        </option>
		                        <option value={ this.state.newConversionPlayer < 5 ? "Red" : "Blue" }>
		                            { this.state.newConversionPlayer == "" ? "Red Team" : "Opposing" }
		                        </option>
		                    </select>
		                </div>
		            </div>

		            <div className="conversion">
		            	<div className="setting">
		                { timeLeft ? 
		                	<div className="time-left">You have <span>{ timeLeft }</span> of conversion left</div>
		                : null }
		                </div>
		                <div className="button setting" onClick={ this.addNewConversion }>Convert</div>
		            </div>
		        </div>,
				<div className="separator" key={ "separator" } />
			] : null }
		</div>;
	}
});
