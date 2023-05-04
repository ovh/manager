const execa = require('execa');
// eslint-disable-next-line import/no-extraneous-dependencies
const { createServer } = require('vite');

console.log(
  `\n\nRun e2e tests of ${process
    .cwd()
    .split('/')
    .slice(-1)} micro-app\n`,
);

const runTests = async () => {
  let exitCode = 0;
  const getBaseConfig = await import(
    '../packages/manager/core/vite-config/src/index.js'
  ).then((module) => module.getBaseConfig);
  const server = await createServer(getBaseConfig());

  await server.listen();

  try {
    const result = await execa('yarn', ['cypress', 'run'], {
      stdio: 'inherit',
      detached: true,
      encoding: 'utf-8',
    });

    exitCode = result.exitCode;
  } catch (err) {
    exitCode = 2;
  } finally {
    await server.close();
  }
  return exitCode;
};

runTests()
  .then(process.exit)
  .catch(() => process.exit(1));
