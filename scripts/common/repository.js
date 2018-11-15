const bump = require('conventional-recommended-bump');
const execa = require('execa');
const fs = require('fs');
const github = require('octonode');
const path = require('path');
const semver = require('semver');

class MonoRepository {
  static hasUntrackedChanges() {
    return execa.shell('git status -s')
      .then(({ stdout }) => stdout.length > 0);
  }

  static getRepositories() {
    return execa.shell('npx lerna ls --json')
      .then(({ stdout }) => JSON.parse(stdout))
      .then(repos => repos.map(repo => new Repository(repo)));
  }

  static release(version, repos) {
    const commitMsg = repos.map(r => `* Package ${r.name} ${r.version}`).join('\n');
    return execa.shell(`git add . && git commit -m 'Release: ${version}' -m '${commitMsg}' --no-verify`)
      .then(() => execa.shell(`git tag -a -m 'release: ${version}' '${version}'`));
  }

  static releaseGithub(accessToken, version, repos, options = {}) {
    const client = github.client(accessToken);
    const repoName = require(path.resolve(__dirname, '..', '..', 'package.json')).name;
    const reposChangelog = repos.map(r => r._changelog).join('');
    return new Promise((resolve, reject) => {
      client.get('/user', {}, (err, status, body) => {
        if (err) {
          reject(err);
        }
        const login = body.login;
        const repository = client.repo(`${login}/${repoName}`);
        repository.release(Object.assign({
          tag_name: version,
          target_commitish: 'master',
          name: version,
          body: `# Release ${version}\n${reposChangelog}`,
          draft: false,
          prerelease: false,
        }, options), (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }
}

class Repository {
  constructor({ name, location, version }) {
    this.name = name;
    this.location = location;
    this.version = version;
  }

  toString() {
    return `${this.name}@${this.version}`;
  }

  getPackageJsonPath() {
    return path.resolve(this.location, 'package.json');
  }

  getPackageJson() {
    return require(this.getPackageJsonPath());
  }

  updatePackageJson(changes) {
    const packageJson = this.getPackageJson();
    for (const [key, value] of Object.entries(changes)) {
      packageJson[key] = value;
    }
    return new Promise((resolve, reject) => {
      const updatedJson = JSON.stringify(packageJson, null, 2);
      fs.writeFile(this.getPackageJsonPath(), updatedJson, (err) => {
        if (err) {
          return reject(`update package.json of ${this.repository.name}: ${err}`);
        }
        return resolve(this);
      });
    });
  }

  updateChangelog() {
    const fetchTags = () => execa.shell('git describe --abbrev=0').then(({ stdout }) => stdout).catch(() => '');
    const createSmokeTag = tag => execa.shell(`git tag ${this.name}@${this.version} ${tag}`);
    const deleteSmokeTag = () => execa.shell(`git tag -d ${this.name}@${this.version}`);
    const getChangelog = () => execa.shell(`lerna exec --scope ${this.name} --concurrency 1 --no-sort -- conventional-changelog \
      --preset angular --lerna-package ${this.name} --commit-path ${this.location}`);
    const updateChangelog = () => execa.shell(`lerna exec --scope ${this.name} --concurrency 1 --no-sort -- conventional-changelog \
      --preset angular --infile CHANGELOG.md --same-file --lerna-package ${this.name} --commit-path ${this.location}`);
    return fetchTags()
      .then(createSmokeTag)
      .then(() => getChangelog()
        .then(({ stdout }) => {
          this._changelog = stdout.replace(/#/, `## ${this.name}`);
        }))
      .then(updateChangelog)
      .then(deleteSmokeTag)
      .then(() => this);
  }

  bump() {
    return new Promise((resolve, reject) => {
      bump({
        preset: 'angular',
        lernaPackage: this.name,
        path: this.location,
      }, (err, recommendation) => {
        if (err) {
          reject(err);
        } else {
          resolve(recommendation);
        }
      });
    }).then((recommendation) => {
      const newVersion = semver.inc(this.version, recommendation.releaseType);
      return this.updatePackageJson({ version: newVersion }).then(() => ({
        repository: this,
        recommendation,
        newVersion,
      }));
    });
  }

  hasChanges() {
    return execa
      .shell(`npx lerna diff ${this.name}`)
      .then(({ stdout }) => stdout.length > 0);
  }

  getDependencies() {
    const { dependencies, peerDependencies } = this.getPackageJson();
    return MonoRepository.getRepositories().then((localRepos) => {
      const result = [];
      const addDependencies = ({ isPeerDependency }) => {
        const depEntries = isPeerDependency ? peerDependencies : dependencies;
        for (const [name, semanticVersion] of Object.entries(depEntries)) {
          const repo = localRepos.find(r => r.name === name);
          if (repo) {
            result.push(new Dependency(this, new Repository(repo), { semanticVersion, isPeerDependency }));
          }
        }
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

  toString() {
    return `${String(this.repository)} ⇒ ${String(this.dependency)} ${this.semanticVersion}${this.isPeerDependency ? ' (peer)' : ''}`;
  }

  isValid() {
    return semver.satisfies(this.dependency.version, this.semanticVersion);
  }

  needsUpdate() {
    return this.semanticVersion !== `^${this.dependency.version}`;
  }

  update() {
    const packageJson = this.repository.getPackageJson();
    const name = this.dependency.name;
    if (this.isPeerDependency) {
      if (packageJson.peerDependencies) {
        packageJson.peerDependencies[name] = `^${this.dependency.version}`;
      }
    } else if (packageJson.dependencies) {
      packageJson.dependencies[name] = `^${this.dependency.version}`;
    }
    return this.repository
      .updatePackageJson(packageJson)
      .then(() => new Dependency(this.repository, this.dependency, {
        semanticVersion: `^${this.dependency.version}`,
        isPeerDependency: this.isPeerDependency,
      }));
  }
}

module.exports = {
  MonoRepository,
  Repository,
  Dependency,
};
