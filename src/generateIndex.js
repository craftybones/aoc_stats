const fs = require('fs');
const vega = require('vega');
const vegaLite = require('vega-lite');
const data = require('../final_data.json');

const template = fs.readFileSync('./template/template.html', 'utf8');
const spec = JSON.parse(fs.readFileSync('./spec/spec.json', 'utf8'));

const toSVG = async (spec, data, template) => {
  spec.data.values = data;
  delete spec.data.url;
  const compiledSpec = vegaLite.compile(spec);
  const parsedSpec = vega.parse(compiledSpec.spec);
  const view = new vega.View(parsedSpec, { renderer: 'none' });
  const svg = await view.toSVG();
  return template.replace('__TIMELINE__', svg);
};

toSVG(spec, data, template).then(newTemplate => {
  fs.mkdirSync('./public');
  fs.writeFileSync('./public/index.html', newTemplate, 'utf8');
});
