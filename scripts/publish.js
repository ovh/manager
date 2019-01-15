const execa = require('execa');

execa.shell('lerna ls -pl --json')
  .then(({ stdout }) => {
    const packages = JSON.parse(stdout);

    return Promise.all(
      packages.map(
        pkg => execa.shell(`npm info ${pkg.name}@${pkg.version}`)
          .then(output => Object.assign(pkg, { publish: output.stdout.length > 0 }))
          .catch((err) => {
            if (!err.stderr.includes('404')) {
              console.error(err); // eslint-disable-line
              process.exit(1);
            }
            return Object.assign(pkg, { publish: false });
          }),
      ),
    );
  })
  .then(packages => Promise.all(
    packages.map((pkg) => {
      if (!pkg.publish) {
        return execa.shell(`npx lerna exec --scope ${pkg.name} -- yarn publish --access=public --non-interactive`);
      }
      return null;
    }),
  ));
