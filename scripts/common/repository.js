/* eslint-disable global-require,
max-classes-per-file, no-use-before-define */
const execa = require('execa');
const path = require('path');

class MonoRepository {
  static getRepositories(includePrivate = false) {
    return execa
      .command(`npx lerna ls ${includePrivate ? '-a' : ''}  --json`, {
        shell: true,
      })
      .then(({ stdout }) => JSON.parse(stdout))
      .then((repos) => repos.map((repo) => new Repository(repo)));
  }
}

class Repository {
  constructor({ name, location, version }) {
    this.name = name;
    this.location = location;
    this.version = version;
  }

  getPackageJsonPath() {
    return path.resolve(this.location, 'package.json');
  }

  getPackageJson() {
    return require(this.getPackageJsonPath()); // eslint-disable-line
  }

  getDependencies() {
    const { dependencies, peerDependencies } = this.getPackageJson();
    return MonoRepository.getRepositories().then((localRepos) => {
      const result = [];
      const addDependencies = ({ isPeerDependency }) => {
        const depEntries = isPeerDependency ? peerDependencies : dependencies;
        Object.entries(depEntries).forEach(([name, semanticVersion]) => {
          const repo = localRepos.find((r) => r.name === name);
          if (repo) {
            result.push(
              new Dependency(this, new Repository(repo), {
                semanticVersion,
                isPeerDependency,
              }),
            );
          }
        });
      };
      if (dependencies) {
        addDependencies({ isPeerDependency: false });
      }
      if (peerDependencies) {
        addDependencies({ isPeerDependency: true });
      }
      return result;
    });
  }
}

class Dependency {
  constructor(repository, dependency, { semanticVersion, isPeerDependency }) {
    this.repository = repository;
    this.dependency = dependency;
    this.semanticVersion = semanticVersion;
    this.isPeerDependency = isPeerDependency;
  }
}
module.exports = {
  MonoRepository,
  Repository,
  Dependency,
};
/* eslint-enable global-require,
max-classes-per-file, no-use-before-define */
