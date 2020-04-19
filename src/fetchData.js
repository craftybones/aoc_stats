const https = require('https');
const fs = require('fs');
const transform = require('./transform').transform;

const options = {
  hostname: 'adventofcode.com',
  port: 443,
  path: '/2019/leaderboard/private/view/829678.json',
  method: 'GET',
  headers: {
    cookie: `session=${process.env['AOC_SESSION_ID']}`,
    'user-agent': 'curl'
  }
};

https.get(options, res => {
  console.log(res.statusCode);
  console.log(res.headers.location);
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => {
    const transformed = transform(JSON.parse(data));
    fs.writeFileSync('final_data.json', JSON.stringify(transformed), 'utf8');
  });
});
