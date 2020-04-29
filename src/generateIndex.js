const fs = require('fs');
const vega = require('vega');
const vegaLite = require('vega-lite');
const data = require('../final_data.json');

const template = fs.readFileSync('./template/template.html', 'utf8');

const toSVG = async (specFile, data, template, key) => {
  const spec = JSON.parse(fs.readFileSync(`./spec/${specFile}.json`, 'utf8'));
  spec.data.values = data;
  delete spec.data.url;
  console.log('Compiling vega lite specs to vega...');
  const compiledSpec = vegaLite.compile(spec);
  console.log('Parsing Vega spec...');
  const parsedSpec = vega.parse(compiledSpec.spec);
  console.log('Creating Vega view...');
  const view = new vega.View(parsedSpec, { renderer: 'none' });
  console.log('Rendering svg...');
  const svg = await view.toSVG();
  return template.replace(key, svg);
};

toSVG('timelines', data, template, '__TIMELINE__')
  .then(newTemplate => toSVG('scores', data, newTemplate, '__SCORES__'))
  .then(newTemplate =>
    toSVG('timelineSummary', data, newTemplate, '__TIMELINE_SUMMARY__')
  )
  .then(newTemplate => toSVG('hours', data, newTemplate, '__HOURS__'))
  .then(newTemplate => toSVG('histogram', data, newTemplate, '__HISTOGRAM__'))
  .then(newTemplate => toSVG('goldSilver', data, newTemplate, '__GOLD__'))
  .then(newTemplate => {
    if (!fs.existsSync('./public')) fs.mkdirSync('./public');
    fs.writeFileSync('./public/index.html', newTemplate, 'utf8');
  });
