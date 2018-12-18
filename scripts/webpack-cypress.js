const execa = require('execa');
const tcpPortUsed = require('tcp-port-used');
const fp = require('find-free-port');

fp(3000, (err, port) => {
  const webpackApp = execa.shell(`yarn start --port ${port}`);
  webpackApp.stdout.pipe(process.stdout);

  tcpPortUsed.waitUntilUsed(port, 500, 1000 * 60 * 2)
    .then(() => {
      const cypressShell = execa.shell(`cypress run --config baseUrl=http://localhost:${port}`);
      cypressShell.stdout.pipe(process.stdout);
      return cypressShell;
    })
    .then(() => execa.shell(`kill -9 $(lsof -i:${port} -t)`))
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); }); // eslint-disable-line
});
