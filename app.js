var mongoose = require('mongoose');
var database = require('./config/db');
var settings = require('./config/settings');
mongoose.connect(database.url);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Connected to the database');
  
  var policymakerProcessor = require('./processor/policymakerProcessor');
  var meetingProcessor = require('./processor/meetingProcessor');
  var agendaUrlParser = require('./processor/agendaUrlParser');
  var issueProcessor = require('./processor/issueProcessor');
  
  policymakerProcessor.process(settings.base_url, function(meetingurl, policymaker){
	meetingProcessor.process(meetingurl, policymaker, function(agendaurl, meeting){
		agendaUrlParser.parse(agendaurl, function(agendaitemurl){
			issueProcessor.process(agendaitemurl);
		});
	});
  });
  
});