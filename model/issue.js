var mongoose = require('mongoose');

var issueSchema = mongoose.Schema({
	category : String,
	category_name: String,
	category_origin_id : Number,
	geometries : Array,
	id : Number,
	register_id : String,
	resource_uri : String,
	slug : String,
	subject : String
});

module.exports = mongoose.model('Issue', issueSchema);
