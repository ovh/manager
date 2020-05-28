const { parentPort, workerData } = require('worker_threads');
const execa = require('execa');

execa
  .command(`cd ${workerData.location} && npm run build --if-present`, {
    shell: true,
  })
  .then(() => parentPort.postMessage(`done - ${workerData.name}`))
  .catch((err) => {
    parentPort.postMessage(`error - ${err.message}
${err.all}`);
    process.exit(err.exitCode);
  });
