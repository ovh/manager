#!/usr/bin/env node
const program = require('commander');
const {
  checkChanges,
  getChangedRepositories,
  bumpRepositories,
  updateChangelogs,
  getDependenciesToUpdate,
  checkDependencies,
  updateDependencies,
  getReleaseVersion,
  release,
  releaseGithub,
  updateSonarProjectVersion,
  writeChangelog,
} = require('./release/index');

program
  .option(
    '--release-name <releaseName>',
    'specify release name, otherwise it will be generated randomly',
    '',
  )
  .option(
    '-s, --seed <seed>',
    'specify seed to generate random version name',
    '',
  )
  .option('-t, --token <token>', 'github access token', '')
  .option('-o, --organization <organization>', 'github organization', '')
  .option('-f, --force', 'Release all packages even if they have no change')
  .option('-c, --changelog <changelog>', 'Output changelog in file <changelog>')
  .option(
    '--no-dependency-check',
    'do not check range when update dependencies',
  )
  .option(
    '--no-check',
    'do not check if mono-repository has uncommited changes',
  )
  .option('--draft-release', 'identify the github release as unpublished')
  .option('--pre-release', 'identify the github release as a prerelease')
  .option('--pre-id <preid>', 'preid for prerelease', '')
  .option(
    '--no-pre-release-file-check',
    'do not check .prerelease file inside packages',
  )
  .option('--no-release', 'skip github release')
  .option(
    '--release-type <releasetype>',
    'Force a release as patch, minor or major',
  )
  .action(() => {
    if (!program.token) {
      console.warn('Missing <token> option, no github release will be done!');
    }

    return Promise.resolve()
      .then(() => (program.check ? checkChanges() : false))
      .then(() => getChangedRepositories(program.force))
      .then((repos) =>
        bumpRepositories(
          repos,
          program.releaseType || null,
          program.preRelease || false,
          program.preId || null,
          !program.noPreReleaseFileCheck || true,
        ),
      )
      .then(updateChangelogs)
      .then((repos) =>
        getDependenciesToUpdate(repos)
          .then((deps) =>
            program.dependencyCheck ? checkDependencies(deps) : deps,
          )
          .then(updateDependencies)
          .then(() => repos),
      )
      .then((repos) => {
        if (program.changelog) {
          writeChangelog(program.changelog, repos).then(() => repos);
        }
        return repos;
      })
      .then((repos) => {
        if (program.release && repos.length) {
          return getReleaseVersion(program.releaseName, program.seed)
            .then((version) => updateSonarProjectVersion(version))
            .then((version) => release(version, repos))
            .then((version) => {
              if (program.token && program.organization) {
                const options = {
                  draft: program.draftRelease || false,
                  prerelease: program.preRelease || false,
                };

                return releaseGithub(
                  program.token,
                  program.organization,
                  version,
                  repos,
                  options,
                );
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
