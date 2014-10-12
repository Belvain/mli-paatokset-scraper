var request = require('request');
var cheerio = require('cheerio');
var Meeting = require('../model/meeting');
var settings = require('../config/settings');

exports.process = function(url, parent, callback){
	request(settings.base_url+url, function(err, resp, body) {
		if(!err) {
			var $ = cheerio.load(body);
			$('a').each(function(i, e) {
				var data = $(this).text();
				if(data !== ""){
					var agendaUrl = $(this).attr('href');
					var meetingParts = data.split(" ");
					var dateParts = meetingParts[0].split('\.');
					var mDate = dateParts[2]+"-"+dateParts[1]+"-"+dateParts[0];
					var mNumber = parseInt(meetingParts[2].replace("(", ""), 10);
					var mYear = parseInt(meetingParts[4].replace(")", ""), 10);
					var meeting = new Meeting({
						policymaker : parent.resource_uri,
						policymaker_name : parent.name,
						date : mDate,
						minutes: false,
						year : mYear,
						number : mNumber,
					});
					meeting.save(function(err, meeting) {
						console.log(err);
						if(!err){
							console.log('Scraped meeting:'+meeting);
							meeting.resource_uri = "/meeting/"+meeting._id;
							meeting.save();
							callback(agendaUrl, meeting);
						}
					});
				}
			});
		}
	});
};
