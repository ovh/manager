const child_process = require('child_process'); // eslint-disable-line
const chokidar = require('chokidar');
const path = require('path');

function regenerateManifest() {
  child_process.exec('node manifest.js');
  console.log('rebuild manifest.json');
}

function watchFragment(fragmendId) {
  const root = path.resolve(__dirname, `../../modules/fragment-${fragmendId}`);
  const bundle = path.resolve(root, 'dist/index.js');
  const watcher = chokidar.watch(bundle);

  watcher.on('add', regenerateManifest);
  watcher.on('change', regenerateManifest);
}

regenerateManifest();
watchFragment('navbar');
