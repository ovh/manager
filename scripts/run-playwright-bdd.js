const { argv } = require('node:process');
const execa = require('execa');
const { createServer } = require('vite');

const isCI = argv.includes('--ci');

console.log(
  `\n\nRun e2e tests of ${process
    .cwd()
    .split('/')
    .slice(-1)} micro-app\n`,
);

const runTests = async () => {
  let exitCode = 0;
  let server;

  const baseConfig = await import(`${process.cwd()}/vite.config.mjs`).then(
    (module) => module.default,
  );

  try {
    server = await createServer({
      ...baseConfig,
      plugins: [],
      server: {
        port: 9001,
      },
      envDir: __dirname,
    });

    await server.listen();

    const result = await execa('npx', ['cucumber-js'], {
      stdio: 'inherit',
      detached: true,
      encoding: 'utf-8',
      env: {
        CI: isCI || undefined,
        NODE_ENV: 'test',
        TS_NODE_PROJECT: 'tsconfig.test.json',
      },
    });

    exitCode = result.exitCode;
  } catch (err) {
    console.log('error:', err);
    exitCode = 2;
  } finally {
    await server?.close();
  }
  return exitCode;
};

runTests()
  .then(process.exit)
  .catch(() => process.exit(1));
