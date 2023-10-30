const { argv } = require('node:process');
const execa = require('execa');
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

  const server = await createServer({
    ...getBaseConfig(),
    server: {
      port: 9001,
    },
    define: {
      ...getBaseConfig().define,
      'process.env.VITE_TEST_BDD': true,
    },
  });

  await server.listen();

  try {
    const result = await execa('npx', ['cucumber-js'], {
      stdio: 'inherit',
      detached: true,
      encoding: 'utf-8',
      env: {
        CI: argv.includes('--ci') || undefined,
        NODE_ENV: 'test',
        TS_NODE_PROJECT: 'tsconfig.test.json',
      },
    });

    exitCode = result.exitCode;
  } catch (err) {
    console.log('error:', err);
    exitCode = 2;
  } finally {
    await server.close();
  }
  return exitCode;
};

runTests()
  .then(process.exit)
  .catch(() => process.exit(1));
