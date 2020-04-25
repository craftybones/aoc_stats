const data = require('../final_data.json');
const https = require('https');

const getEventsWithinWindow = (data, minutes) => {
  const now = Date.now();
  const minutesAgo = new Date(now - minutes * 60 * 1000);
  return data.filter(d => new Date(d.ts) > minutesAgo);
};

const message = ({ name, stars, level }) =>
  `${name} attained ${stars} stars and is at level ${level}`;

const notifySlack = events => {
  const url = process.env.SLACK_URL;
  const text = events.map(message).join('\n');
  const options = {
    method: 'POST'
  };
  const data = { text };
  console.log(data);
  const req = https.request(url, options, res => {
    console.log('Status code from slack', res.statusCode);
  });
  req.write(JSON.stringify(data));
  req.end();
};

const minutes = +process.env.MINUTES || 15;
console.log('minutes is', minutes);
const filteredEvents = getEventsWithinWindow(data, minutes);
console.log(filteredEvents);
if (filteredEvents.length > 0) notifySlack(filteredEvents);
