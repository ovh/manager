/* eslint-disable no-console */
const ora = require('ora');
const { MonoRepository } = require('../common/repository');
const { Codename, Sample } = require('@ovh-ux/codename-generator');

Promise.prototype.logging = function logging(opts) { // eslint-disable-line no-extend-native
  ora.promise(this, opts);
  return this;
};

const checkChanges = () => MonoRepository.hasUntrackedChanges().then((hasChanges) => {
  if (hasChanges) {
    throw new Error('Repository has pending changes');
  }
});

const getChangedRepositories = () => MonoRepository
  .getRepositories()
  .logging('listing repositories')
  .then((repos) => {
    repos.forEach(r => console.log(`    ${r.toString()}`));
    const changes = repos.map(r => r.hasChanges());
    return Promise.all(changes)
      .then(hasChanges => repos.filter((r, id) => hasChanges[id]))
      .logging('listing changes')
      .then((changedRepos) => {
        changedRepos.forEach(r => console.log(`    ${r.toString()} has changes`));
        return repos;
      });
  });

const bumpRepositories = repos => Promise.all(repos.map(repo => repo.bump()))
  .logging('bumping repositories')
  .then((bumps) => {
    bumps.forEach(b => console.log(`    ${b.recommendation.releaseType} ${b.repository.toString()} to ${b.newVersion}`));
    return bumps.map(b => b.repository);
  });

const updateChangelogs = repos => Promise.all(repos.map(repo => repo.updateChangelog()))
  .logging('updating changelogs')
  .then((updatedRepos) => {
    updatedRepos.forEach(r => console.log(`    updated changelog of ${r.toString()}`));
    return repos;
  });

const getDependenciesToUpdate = repos => Promise.all(repos.map(r => r.getDependencies()))
  .then(deps => [].concat(...deps)) // flatten all deps
  .then(deps => deps.filter(dep => dep.needsUpdate()))
  .logging('listing dependencies to update')
  .then((deps) => {
    deps.forEach(d => console.log(`    in ${d.repository.name}: ${d.dependency.name}${d.semanticVersion} needs to be updated to ${d.dependency.version}`));
    return deps;
  });

const checkDependencies = dependencies => new Promise((resolve, reject) => {
  const invalid = dependencies.filter(d => !d.isValid());
  if (invalid.length) {
    reject(invalid.map(d => `invalid dependency ${String(d)}`));
  } else {
    resolve(dependencies);
  }
})
  .logging('checking dependencies')
  .then((deps) => {
    console.log('    everything is compatible');
    return deps;
  });

const updateDependencies = dependencies => Promise
  .all(dependencies.map(d => d.update()))
  .logging('updating dependencies')
  .then((deps) => {
    deps.forEach(d => console.log(`    in ${d.repository.name}: updated ${d.dependency.name} dependency to ${d.semanticVersion}`));
    return deps;
  });

const getReleaseVersion = (version, seed) => {
  if (!version) {
    const codename = new Codename(Sample, seed || '');
    codename.encode().toLowerCase().trim().replace(' ', '-');
    return MonoRepository.getReleaseVersion(version);
  }
  return Promise.resolve().then(() => version);
};

const release = (version, repos) => MonoRepository.release(version, repos)
  .logging(`releasing ${version}`)
  .then(() => console.log(`    released ${version}`))
  .then(() => version);

const releaseGithub = (accessToken, version, repos, options = {}) => MonoRepository
  .releaseGithub(accessToken, version, repos, options)
  .logging(`releasing on github ${version}`)
  .then(() => console.log(`    released ${version} on github`))
  .then(() => version);

module.exports = {
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
};
