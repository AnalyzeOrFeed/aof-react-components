const Events = require("ampersand-events");

class SearchableModalApi {
	constructor() {}

	show(source, dataset, searchBy, imageBy, showRemove, placeholder, callback) {
		this.trigger("show", source, dataset, searchBy, imageBy, showRemove, placeholder, callback);
	}
}

let api = new SearchableModalApi();
Events.createEmitter(api);
module.exports = api;
