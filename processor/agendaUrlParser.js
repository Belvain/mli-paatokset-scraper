var request = require('request');
var cheerio = require('cheerio');
var settings = require('../config/settings');
var ignorelinks = ["Kokouksen laillisuus ja päätösvaltaisuus", "Pöytäkirjan tarkastus"];

exports.parse = function(url, callback){
	request(settings.base_url+url, function(err, resp, body) {
		if(!err) {
			var $ = cheerio.load(body);
			$('a').each(function(i, e) {
				var agendaText = $(this).text();
				if(ignorelinks.indexOf(agendaText) === -1 && agendaText !== "") {
					var hash = $(this).attr('href');
					if(typeof(hash) !== 'undefined'){
					var agendaItemUrl = url.substring(0, url.lastIndexOf("/"))+"/"+hash;
					agendaItemUrl = settings.base_url + agendaItemUrl.replace("/", "");
						console.log('Parsed agendaItemUrl: '+agendaItemUrl);
						callback(agendaItemUrl);
					}
				}
			});
		}
	});
};