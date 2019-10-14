const execa = require('execa');
const fp = require('find-free-port');
const kill = require('kill-port');
const tcpPortUsed = require('tcp-port-used');

fp(3000, (err, port) => {
  const webpackApp = execa('yarn', ['start:dev', '--port', port]);
  webpackApp.stdout.pipe(process.stdout);

  tcpPortUsed.waitUntilUsed(port, 500, 1000 * 60 * 5)
    .then(() => {
      const cypressShell = execa('cypress', ['run', '--config', `baseUrl=http://localhost:${port}`]);
      cypressShell.stdout.pipe(process.stdout);
      return cypressShell;
    })
    .then(() => kill(port))
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); }); // eslint-disable-line no-shadow
});
