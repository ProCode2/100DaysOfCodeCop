const Twit = require('twit');
const config = require('./config.js');

const T = new Twit(config);

//initialize a user stream
const stream = T.stream('statuses/filter', { track: '@AskCoders' });

console.log('works');

//trigger when someone mentions me
stream.on('tweet', mentioned);


function mentioned(event){
	console.log(`${event.in_reply_to_screen_name} is reported by ${event.user.name}`);
}
