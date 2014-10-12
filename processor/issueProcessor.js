var request = require('request');
var cheerio = require('cheerio');
var Issue = require('../model/issue');
var settings = require('../config/settings');

exports.process = function(url, callback){
	request(url, function(err, resp, body) {
		if(!err) {
			var $ = cheerio.load(body);
			var issueNumber;
			var issueNumberElement;
			$('div').each(function(){
				if($(this).text() !== ""){
					if($(this).text().indexOf('Asianro') !== -1){
						issueNumber = $(this).text();
						issueNumberElement = $(this);
						return false;
					}
				}
			});
			if(typeof(issueNumberElement) !== 'undefined'){
				var subject;
				if(issueNumberElement.next('b').text() !== "Liitteet"){
					subject = issueNumberElement.next('b').text();
				}else{
					subject = issueNumberElement.next('b').next('b').text();
				}
				var slug = issueNumber.replace(/\s/g, "").replace(/\//g, "-").toLowerCase();
				Issue.count({}, function( err, count){
					var issueid = count + 1;
					var resourceUri = "/issue/"+issueid;
					var issue = new Issue({
						id : issueid,
						register_id : issueNumber,
						resource_uri : resourceUri,
						slug : slug,
						subject : subject
					});
					issue = issue.toObject();
					delete issue._id;
					Issue.findOneAndUpdate(
							{slug: slug},
							issue,
							{upsert: true},
							function(err, issue) {
								console.log(err);
								if(!err){
									console.log('Scraped issue:'+issue);
								}
							}
					);
				});
			}
		}
	});
};
