var mongoose = require('mongoose');

var meetingSchema = mongoose.Schema({
	policymaker : String,
	policymaker_name : String,
	date : String,
	minutes: {'type' : Boolean, 'default' : false},
	year : Number,
	number : Number,
	resource_uri : String
});

module.exports = mongoose.model('Meeting', meetingSchema);
