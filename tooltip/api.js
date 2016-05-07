const Events = require("ampersand-events");

class TooltipApi {
	constructor() {
		this.text = null;
	}

	showTooltip(text) {
		this.text = text;
		this.trigger("show", text);
	}

	hideTooltip() {
		this.text = null;
		this.trigger("hide");
	}
}

let api = new TooltipApi();
Events.createEmitter(api);
module.exports = api;
