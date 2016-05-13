const React    = require("react");
const ReactDOM = require("react-dom");
const _        = require("lodash");
const request  = require("superagent");

const AutoComplete    = require("../src/autocomplete");
const Button          = require("../src/button");
const ButtonImage     = require("../src/button-image");
const Game            = require("../src/game");
const Modal           = require("../src/modal");
const ObjectImage     = require("../src/object-image");
const SearchableModal = require("../src/searchable-modal");
const Spinner         = require("../src/spinner");
const Tooltip         = require("../src/tooltip");

const baseUrl = "https://ddragon.leagueoflegends.com/cdn/6.9.1/img/";
let champions = [];
_.each(require("./data/champions.json"), (value, key) => {
	champions.push({
		id: value.id,
		name: value.name,
		image: baseUrl + "champion/" + value.image.full
	});
});

let spells = [];
_.each(require("./data/spells.json"), (value, key) => {
	spells.push({
		id: value.id,
		name: value.name,
		image: baseUrl + "spell/" + value.image.full
	});
});

let items = [];
_.each(require("./data/items.json"), (value, key) => {
	items.push({
		id: value.id,
		name: value.name,
		image: baseUrl + "item/" + value.image.full
	});
});

let leagues = [{
	id: 2,
	name: "Bronze",
	image: "https://aof.gg/bronze.png"
},{
	id: 3,
	name: "Silver",
	image: "https://aof.gg/silver.png"
},{
	id: 4,
	name: "Gold",
	image: "https://aof.gg/gold.png"
},{
	id: 5,
	name: "Platinum",
	image: "https://aof.gg/platinum.png"
},{
	id: 6,
	name: "Diamond",
	image: "https://aof.gg/diamond.png"
},{
	id: 7,
	name: "Master",
	image: "https://aof.gg/master.png"
},{
	id: 8,
	name: "Challenger",
	image: "https://aof.gg/challenger.png"
}];

let game = require("./data/game.json");
_.each(game.players, player => {
	player.champion = _.find(champions, { "id": player.championId });
	player.spell1 = _.find(spells, { id: player.spell1 });
	player.spell2 = _.find(spells, { id: player.spell2 });
	player.league = _.find(leagues, { id: player.leagueId });
	player.items2 = _.map(player.items, id => _.find(items, { "id": id }));
	delete player.items;
});
_.each(game.bans, ban => ban.champion = _.find(champions, { id: ban.championId }));
game.hasEndgameStats = true;
game.region = "JP";
game.type = "Ranked";
game.version = "6.9.1";

_.each(game.conversions, (conv) => {
	conv.championName = _.find(champions, { id: conv.championId }).name;
});

const App = React.createClass({
	componentWillMount: function() {
		require("./base.scss");
	},
	componentDidMount: function() {
		setTimeout(() => {
			console.log("Fake async loading items");
			_.each(game.players, player => player.items = player.items2);
			this.refs.game.forceUpdate();
		}, 3000);
	},
	getInitialState: function() {
		return {
			showModal: false,
		};
	},
	getResults: function(query, callback) {
		request.get("https://api.aof.gg/v2/names")
	    .query({ s: query })
	    .end(function(err, res) {
	        if (err) return;
	        callback(res.body);
	    });
	},
	handleClose: function() {
		this.setState({ showModal: false });
	},
	handleWatch: function(game) {
		console.log(game);
	},
	render: function() {
		let divStyle = {
			marginRight: "50px",
		};

		return <div style={{ padding: "2em" }}>
			<h1>Analyze Or Feed Common React Components Test</h1>

			<div style={{ display: "flex", flexWrap: "wrap" }}>
				<div style={ divStyle }>
					<h2>Autocomplete</h2>
					<AutoComplete
						getResults={ this.getResults }
					/>
				</div>

				<div style={ divStyle }>
					<h2>Button</h2>
					<div style={{ display: "flex", alignItems: "center" }}>
						<Button>Test button</Button>
						<Button small={ true } highlighted={ true }>
							Small highlighted<br />test button
						</Button>
					</div>
				</div>

				<div style={ divStyle }>
					<h2>Button Image</h2>
					<ButtonImage
						src="https://aof.gg/4b72f889bed9164cccf5b7b3cd7c12de.svg"
						height={ 50 }
						width={ 50 }
					/>
				</div>

				<div style={ divStyle }>
					<h2>Modal</h2>
					<Button onClick={ () => this.setState({ showModal: true }) }>
						Modal
					</Button>
					<Modal show={ this.state.showModal } onClose={ this.handleClose }>
						Hi, this is a friendly test modal!
					</Modal>
				</div>

				<div style={ divStyle }>
					<h2>Object Image</h2>
					<ObjectImage
						dataset={ champions }
						default="Champion"
						displayBy="name"
						imageBy="image"
					/>
					<div style={{ display: "inline-block", width: "20px" }}></div>
					<ObjectImage
						data={ champions[0] }
						round={ true }
						default="Champion"
						displayBy="name"
						imageBy="image"
					/>
				</div>

				<div style={ divStyle }>
					<h2>Spinner</h2>
					<Spinner />
				</div>

				<div style={ divStyle }>
					<h2>Game</h2>
					<Game
						ref="game"
						game={ game }
						showConversions={ true }
						conversionTimeLeft={ 1232 }
						onWatch={ this.handleWatch }
						link="https://aof.gg"
						linkText="External"
					/>
				</div>
			</div>

			<Tooltip />

			<SearchableModal />
		</div>;
	}
});

ReactDOM.render(<App />, document.getElementById("app"));
