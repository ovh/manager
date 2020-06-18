const fs = require('fs');
const path = require('path');

const manifest = {
  fragment: {},
  template: {},
};

function buildFragment(fragmendId) {
  const root = path.resolve(__dirname, `../../modules/fragment-${fragmendId}`);
  const bundle = path.resolve(root, 'dist/index.js');
  const { version } = JSON.parse(
    fs.readFileSync(path.resolve(root, 'package.json')),
  );

  fs.mkdirSync(`dist/${fragmendId}/`, { recursive: true });
  fs.copyFileSync(
    bundle,
    path.resolve(__dirname, `dist/${fragmendId}/${fragmendId}-${version}.js`),
  );

  fs.writeFileSync(
    path.resolve(__dirname, 'dist/manifest.json'),
    JSON.stringify({
      navbar: `/ufrontend/${fragmendId}/${fragmendId}-${version}.js`,
    }),
    'utf8',
  );

  manifest.fragment[
    fragmendId
  ] = `/ufrontend/${fragmendId}/${fragmendId}-${version}.js`;
}

function buildTemplate(templateId) {
  const { version } = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json')),
  );
  fs.mkdirSync(`dist/template/`, { recursive: true });
  fs.copyFileSync(
    path.resolve(__dirname, `src/template/${templateId}.html`),
    path.resolve(__dirname, `dist/template/${templateId}-${version}.html`),
  );

  manifest.template[
    templateId
  ] = `/ufrontend/template/${templateId}-${version}.html`;
}

buildFragment('navbar');
buildTemplate('index');

fs.writeFileSync(
  path.resolve(__dirname, 'dist/manifest.json'),
  JSON.stringify(manifest),
);
