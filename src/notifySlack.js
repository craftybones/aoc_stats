const data = require('../final_data.json');
const https = require('https');

const getEventsWithinWindow = (data, minutes) => {
  const now = Date.now();
  const minutesAgo = new Date(now - minutes * 60 * 1000);
  return data.filter(d => new Date(d.ts) > minutesAgo);
};

const message = ({ name, stars, level }) =>
  `${name} attained ${stars} stars and is at level ${level}`;

const notify = (text, url) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': "application/json"}
  };
  const data = { text, username: "aoc_bot", icon_url: "https://robohash.org/aoc_bot"  };
  console.log(data);
  const req = https.request(url, options, res => {
    console.log('Status code from slack', res.statusCode);
  });
  req.write(JSON.stringify(data));
  req.end();
}

const notifySlack = events => {
  const text = events.map(message).join('\n');
  const url = process.env.SLACK_URL;
  notify(text, url);
};

const notifyMattermost = events => {
  const text = events.map(message).join('\n');
  const url = process.env.MATTERMOST_URL;
  notify(text, url);
};

const minutes = +process.env.MINUTES || 15;
const filteredEvents = getEventsWithinWindow(data, minutes);
// if (filteredEvents.length > 0) notifySlack(filteredEvents);
if (filteredEvents.length > 0) notifyMattermost(filteredEvents);
