/* eslint no-console: 0 */
const program = require('commander');
const {
  checkChanges, getChangedRepositories, bumpRepositories,
  updateChangelogs, getDependenciesToUpdate, checkDependencies,
  updateDependencies, release, releaseGithub,
} = require('./release/index');

program
  .option('-v, --version <version>', 'version to release', '')
  .option('-t, --token <token>', 'github access token', '')
  .option('--no-check', 'do not check if mono-repository has uncommited changes')
  .option('--draft-release', 'identify the github release as unpublished')
  .option('--pre-release', 'identify the github release as a prerelease')
  .action(() => {
    if (!program.version) {
      console.warn('Missing <version> option, no release will be done!');
    }
    if (!program.token) {
      console.warn('Missing <token> option, no github release will be done!');
    }
    return Promise.resolve()
      .then(() => (program.check ? checkChanges() : false))
      .then(getChangedRepositories)
      .then(bumpRepositories)
      .then(updateChangelogs)
      .then(repos => getDependenciesToUpdate(repos)
        .then(checkDependencies)
        .then(updateDependencies)
        .then(() => repos))
      .then((repos) => {
        if (program.version) {
          return release(program.version, repos).then(() => {
            if (program.token) {
              const options = {
                draft: program.draftRelease || false,
                prerelease: program.preRelease || false,
              };
              return releaseGithub(program.token, program.version, repos, options);
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
