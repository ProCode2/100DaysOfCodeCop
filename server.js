const Twit = require('twit');
const config = require('./config.js');
const dbconfig = require('./dbconfig.js');
const db = require('knex')(dbconfig);

const T = new Twit(config);

//initialize a user stream
const stream = T.stream('statuses/filter', { track: '@AskCoders unfold' });

console.log('works');

//trigger when someone mentions me
stream.on('tweet', mentioned);


function mentioned(event){
	console.log(event);
	console.log(`${event.in_reply_to_screen_name} is reported by ${event.user.name}`);
	db('reports').insert({
		reported_at: event.created_at,
		reported_by: event.user.screen_name,
		arrest_tweet: event.id_str,
		reported_tweet: event.in_reply_to_status_id_str,
		tweeted_by: event.in_reply_to_screen_name
	})
	.then(db.commit)
	.catch(err => {
		console.log('uh oh!');
		let name = event.user.screen_name;
		let reply = "Elementary, my dear Watson(@"+name+")!That head of yours should be for use as well as ornament! This tweet is recorded. You can report it, if it's abusing the 100DaysOfCode hashtag.";
		let params = {
			status: reply,
			in_reply_to_status_id: event.id_str
		};
		T.post('statuses/update', params, function(err, data , response){
			if(err){
				console.log(err);
			}
		});
	});
}
