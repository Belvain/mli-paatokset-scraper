var mongoose = require('mongoose');

var policymakerSchema = mongoose.Schema({
	name : String,
	origin_id : String,
	resource_uri : String
});

module.exports = mongoose.model('Policymaker', policymakerSchema);