const program = require('commander');
const {
  checkChanges, getChangedRepositories, bumpRepositories,
  updateChangelogs, getDependenciesToUpdate, checkDependencies,
  updateDependencies, getReleaseVersion, release, releaseGithub,
} = require('./release/index');

program
  .option('-v, --version <version>', 'specify version name to release, otherwise it will be generated randomly', '')
  .option('-s, --seed <seed>', 'specify seed to generate random version name', '')
  .option('-t, --token <token>', 'github access token', '')
  .option('--no-check', 'do not check if mono-repository has uncommited changes')
  .option('--draft-release', 'identify the github release as unpublished')
  .option('--pre-release', 'identify the github release as a prerelease')
  .option('--no-release', 'skip github release')
  .action(() => {
    if (!program.token) {
      console.warn('Missing <token> option, no github release will be done!');
    }
    return Promise.resolve().then(() => (program.check ? checkChanges() : false)).then(getChangedRepositories)
      .then(bumpRepositories)
      .then(updateChangelogs)
      .then(repos => getDependenciesToUpdate(repos)
        .then(checkDependencies)
        .then(updateDependencies)
        .then(() => repos))
      .then((repos) => {
        if (program.release) {
          return getReleaseVersion(program.version, program.seed)
            .then(version => release(version, repos))
            .then(version => {
              if (program.token) {
                const options = {
                  draft: program.draftRelease || false,
                  prerelease: program.preRelease || false,
                };
                return releaseGithub(program.token, version, repos, options);
              }
            });
        }
      })
      .catch((err) => {
        console.error(`\n${err}`);
        process.exit(1);
      });
  })
  .parse(process.argv);
