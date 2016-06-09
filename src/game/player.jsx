const React = require("react");
const cx = require("classnames");

const ObjectImage = require("../object-image");

const PropTypes = require("./propTypes");

module.exports = React.createClass({
	propTypes: {
		player: PropTypes.player.isRequired
	},
	render: function() {
		let goldEarned = this.props.player.goldEarned;
		if (goldEarned >= 1000) {
			goldEarned /= Math.pow(10, 3);
			goldEarned = goldEarned.toFixed(1) + "K";
		}

		let items = this.props.player.items || [];
		for (let i = 0; i < 7; i++) {
			if (!items[i]) items[i] = null;
		}

		return <div className={ cx("component-gamePlayer", { highlighted: this.props.player.pesId && this.props.player.pesId != -1 }) }>
			<div className="championBlock">
				<div>
					<ObjectImage
						data={ this.props.player.champion }
						displayBy="name"
						imageBy="image"
						size={ 50 }
						crop={ 10 }
					/>
				</div>

				<div className="spellBlock">
					<div>
						<ObjectImage
							data={ this.props.player.spell1 }
							displayBy="name"
							imageBy="image"
							size={ 23 }
						/>
					</div>
					<div>
						<ObjectImage
							data={ this.props.player.spell2 }
							displayBy="name"
							imageBy="image"
							size={ 23 }
						/>
					</div>
				</div>
			</div>

			<div className="summonerBlock">
				<div className="name">
					{ this.props.player.name }
				</div>
				<div className="stats">
					<div>
						{ Number.isFinite(this.props.player.goldEarned) ? [
							<img src={ require("./assets/coins.png") } key="image" />,
							<span key="text">{ goldEarned }</span>
						] : null }
					</div> 
					
					<div>
						{ Number.isFinite(this.props.player.minionsKilled) ? [
							<img src={ require("./assets/minions.png") } key="image" />,
							<span key="text">{ this.props.player.minionsKilled }</span>
						] : null }
					</div>
				</div>
			</div>

			<div className="leagueBlock">
				{ this.props.player.league ? 
					<ObjectImage
						data={ this.props.player.league }
						displayBy="name"
						imageBy="image"
						size={ 40 }
					/>
				: null }
			</div>

			<div className="itemBlock">
				<div className="kda">
					<div>
						{ Number.isFinite(this.props.player.kills) ? 
							<span>{ this.props.player.kills } / { this.props.player.deaths } / { this.props.player.assists }</span>
						:
							<span>?</span>
						}
						<span className="tiny">KDA</span>
					</div>
				</div>
				
				<div className="items">
					{ items.map((item, index) => {
						return <ObjectImage
							className="item"
							data={ item }
							displayBy="name"
							imageBy="image"
							size={ 24 }
							key={ index }
						/>;
					}) }
				</div>
			</div>
		</div>;
	}
});
