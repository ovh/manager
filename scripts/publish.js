#!/usr/bin/env node
const execa = require('execa');
const pSeries = require('p-series');
const fs = require('fs');

execa('lerna', ['ls', '-pl', '--json', '--toposort'])
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
                  execa('lerna', [
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
                // () =>
                //   execa('lerna', [
                //     'exec',
                //     '--scope',
                //     pkg.name,
                //     '--',
                //     'yarn',
                //     'publish',
                //     '--access=public',
                //     '--non-interactive',
                //   ]),
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
