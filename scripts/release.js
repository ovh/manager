/* eslint-disable no-console */
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
  .option('--no-dependency-check', 'do not check range when update dependencies')
  .option('--no-check', 'do not check if mono-repository has uncommited changes')
  .option('--draft-release', 'identify the github release as unpublished')
  .option('--pre-release', 'identify the github release as a prerelease')
  .option('--pre-id <preid>', 'preid for prerelease', '')
  .option('--no-release', 'skip github release')
  .action(() => {
    if (!program.token) {
      console.warn('Missing <token> option, no github release will be done!');
    }
    return Promise.resolve()
      .then(() => (program.check ? checkChanges() : false))
      .then(getChangedRepositories)
      .then(repos => bumpRepositories(
        repos,
        program.preRelease || false,
        program.preId || null,
      ))
      .then(updateChangelogs)
      .then(repos => getDependenciesToUpdate(repos)
        .then((deps) => {
          if (program.dependencyCheck) {
            return checkDependencies(deps);
          }
          return deps;
        })
        .then(updateDependencies)
        .then(() => repos))
      .then((repos) => {
        if (program.release && repos.length) {
          return getReleaseVersion(program.version, program.seed)
            .then(version => release(version, repos))
            .then((version) => {
              if (program.token) {
                const options = {
                  draft: program.draftRelease || false,
                  prerelease: program.preRelease || false,
                };
                return releaseGithub(program.token, version, repos, options);
              }
              return undefined;
            });
        }
        return undefined;
      })
      .catch((err) => {
        console.error(`\n${err}`);
        process.exit(1);
      });
  })
  .parse(process.argv);
