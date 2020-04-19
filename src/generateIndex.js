const fs = require('fs');
const vega = require('vega');
const vegaLite = require('vega-lite');
const data = require('../final_data.json');

const template = fs.readFileSync('./template/template.html', 'utf8');
const spec = JSON.parse(fs.readFileSync('./spec/spec.json', 'utf8'));

const toSVG = async (spec, data, template) => {
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
  return template.replace('__TIMELINE__', svg);
};

toSVG(spec, data, template).then(newTemplate => {
  if (!fs.existsSync('./public')) fs.mkdirSync('./public');
  fs.writeFileSync('./public/index.html', newTemplate, 'utf8');
});
