#!/usr/bin/env node
const execa = require('execa');
const pSeries = require('p-series');
const fs = require('fs');

const { LERNA_VERSION } = process.env;

if (!LERNA_VERSION) {
  console.error('Please provide LERNA_VERSION environment variable');
  process.exit(1);
}

const invokeLerna = (args) =>
  execa('npx', ['--no', `lerna@${LERNA_VERSION}`, '--', ...args]);

invokeLerna(['ls', '-pl', '--json', '--toposort'])
  .then(({ stdout }) => {
    const packages = JSON.parse(stdout);

    return Promise.all(
      packages.map((pkg) => {
        const parseFullPkg = JSON.parse(
          fs.readFileSync(`${pkg.location}/package.json`, {
            encoding: 'utf-8',
          }),
        );
        return execa('npm', ['info', `${pkg.name}@${pkg.version}`])
          .then((output) =>
            Object.assign(pkg, {
              publish: output.stdout.length > 0,
              ignoreDependencies: parseFullPkg.ignoreDependencies,
            }),
          )
          .catch((err) => {
            if (!err.stderr.includes('404')) {
              console.error(err);
              process.exit(1);
            }
            return Object.assign(pkg, {
              publish: false,
              ignoreDependencies: parseFullPkg.ignoreDependencies,
            });
          });
      }),
    );
  })
  .then((packages) =>
    pSeries(
      packages
        .map((pkg) => {
          if (!pkg.publish) {
            return () => {
              console.log(`Publishing package ${pkg.name}`);
              return pSeries([
                () =>
                  invokeLerna([
                    'exec',
                    '--scope',
                    pkg.name,
                    pkg.ignoreDependencies ? '' : '--include-dependencies',
                    '--',
                    'npm',
                    'run',
                    'prepare',
                    '--if-present',
                  ]),
                () =>
                  invokeLerna([
                    'exec',
                    '--scope',
                    pkg.name,
                    '--',
                    'yarn',
                    'publish',
                    '--access=public',
                    '--non-interactive',
                  ]),
              ]);
            };
          }
          console.log(
            `Package ${pkg.name} has been skipped (already published)`,
          );
          return null;
        })
        .filter((p) => p !== null),
    ),
  );
