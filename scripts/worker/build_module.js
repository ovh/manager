const { parentPort, workerData } = require('worker_threads');
const execa = require('execa');

execa
  .shell(`cd ${workerData.location} && npm run build --if-present`)
  .then(() => parentPort.postMessage(`done ${workerData.name}`));
