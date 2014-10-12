var request = require('request');
var cheerio = require('cheerio');
var Policymaker = require('../model/policymaker');
var settings = require('../config/settings');

var ignorelinks = ["Tulevien kokousten esityslistat", "Ohje", "Tekstihaku"];

exports.process = function(url, callback){
	request(url, function(err, resp, body) {
		if(!err) {
			var $ = cheerio.load(body);
			$('a').each(function(i, e) {
				var name = $(this).text();
				if(ignorelinks.indexOf(name) === -1 && name !== ""){
					var meetingUrl = $(this).attr('href');
					meetingUrl = meetingUrl.replace('&Expand=1', '');
					var resourceUri = "/committee/"+i;
					var policymaker = new Policymaker({
						name: name
					});
					policymaker.save(function(err, policymaker){
						console.log(err);
						if(!err){
							policymaker.resource_uri = "/committee/"+policymaker._id;
							policymaker.save();
							console.log('Scraped policymaker: '+policymaker);
							callback(meetingUrl, policymaker);
						}
					});
				}
			});
		}
	});
};
