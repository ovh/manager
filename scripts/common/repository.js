/* eslint-disable global-require, import/no-dynamic-require,
max-classes-per-file, no-use-before-define */
const concat = require('concat-stream');
const conventionalCommitsParser = require('conventional-commits-parser');
const bump = require('conventional-recommended-bump');
const execa = require('execa');
const fs = require('fs');
const github = require('octonode');
const gitRawCommits = require('git-raw-commits');
const path = require('path');
const semver = require('semver');

class MonoRepository {
  static getName() {
    return execa
      .command('git rev-parse --show-toplevel', { shell: true })
      .then(({ stdout }) => path.basename(stdout));
  }

  static hasUntrackedChanges() {
    return execa
      .command('git status -s', { shell: true })
      .then(({ stdout }) => stdout.length > 0);
  }

  static getRepositories(includePrivate = false) {
    return execa
      .command(`npx lerna ls ${includePrivate ? '-a' : ''}  --json`, {
        shell: true,
      })
      .then(({ stdout }) => JSON.parse(stdout))
      .then((repos) => repos.map((repo) => new Repository(repo)));
  }

  static getReleaseVersion(version) {
    const result = version
      .toLowerCase()
      .trim()
      .replace(' ', '-');
    return execa
      .command(`git tag -l '${version}*' --sort=taggerdate | tail -1`, {
        shell: true,
      })
      .then(({ stdout }) => stdout)
      .then((v) => {
        if (v) {
          const matches = v.match(/-(\d+)$/);
          if (matches && matches.length > 1) {
            const nextId = parseInt(matches[1], 10) + 1;
            return `${result}-${nextId}`;
          }
          return `${result}-1`;
        }
        return result;
      });
  }

  static release(version, repos) {
    const commitMsg = repos
      .map((r) => `* Package ${r.name} ${r.getPackageJson().version}`)
      .join('\n');
    return execa
      .command(
        `git add . && git commit -s -m'Release: ${version}' -m '${commitMsg}' --no-verify`,
        { shell: true },
      )
      .then(() =>
        execa.command(`git tag -a -m 'release: ${version}' '${version}'`, {
          shell: true,
        }),
      )
      .then((v) =>
        execa
          .command('git push origin master --tags', { shell: true })
          .then(() => v),
      );
  }

  static updateSonarProjectVersion(newVersion) {
    const sonarcloudPropertiesFile = '.sonarcloud.properties';
    return new Promise((resolve, reject) => {
      return fs.readFile(
        sonarcloudPropertiesFile,
        'utf-8',
        (readError, fileContent) => {
          if (readError) {
            return reject(
              new Error(`read .sonarcloud.properties file: ${readError}`),
            );
          }

          const [, currentVersion] = fileContent.match(
            /sonar\.projectVersion=(([a-z]+-[a-z]+-\d+)|([a-z]+-[a-z]+))/,
          );
          const updatedContent = fileContent.replace(
            currentVersion,
            newVersion,
          );

          return fs.writeFile(
            sonarcloudPropertiesFile,
            updatedContent,
            (writeError, updatedFile) => {
              if (writeError) {
                return reject(
                  new Error(
                    `update .sonarcloud.properties file: ${writeError}`,
                  ),
                );
              }

              return resolve(updatedFile);
            },
          );
        },
      );
    });
  }

  static writeChangelog(file, repos) {
    return new Promise((resolve, reject) => {
      fs.writeFileSync(file, repos.map((r) => r.changelog).join(''), (err) => {
        if (err) {
          return reject(
            new Error(`update package.json of ${this.repository.name}: ${err}`),
          );
        }
        return resolve(this);
      });
    });
  }

  static releaseGithub(
    accessToken,
    organization,
    version,
    repos,
    options = {},
  ) {
    const client = github.client(accessToken);
    const reposChangelog = repos.map((r) => r.changelog).join('');
    return this.getName().then(
      (repoName) =>
        new Promise((resolve, reject) => {
          client.get('/user', {}, (err) => {
            if (err) {
              reject(err);
            }
            const repository = client.repo(`${organization}/${repoName}`);
            repository.release(
              {
                tag_name: version,
                target_commitish: 'master',
                name: version,
                body: `# Release ${version}\n${reposChangelog}`,
                draft: false,
                prerelease: false,
                ...options,
              },
              (releaseErr) => {
                if (releaseErr) {
                  return reject(releaseErr);
                }
                return resolve();
              },
            );
          });
        }),
    );
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

    Object.entries(changes).forEach(([key, value]) => {
      packageJson[key] = value;
    });
    return new Promise((resolve, reject) => {
      const updatedJson = JSON.stringify(packageJson, null, 2);
      fs.writeFile(this.getPackageJsonPath(), updatedJson, (err) => {
        if (err) {
          return reject(
            new Error(`update package.json of ${this.repository.name}: ${err}`),
          );
        }
        return resolve(this);
      });
    });
  }

  static fetchTags() {
    return execa
      .command('git describe --abbrev=0', { shell: true })
      .then(({ stdout }) => stdout)
      .catch(() => '');
  }

  createSmokeTag(tag) {
    return execa.command(`git tag ${this.name}@${this.version} ${tag}`, {
      shell: true,
    });
  }

  deleteSmokeTag() {
    return execa.command(`git tag -d ${this.name}@${this.version}`, {
      shell: true,
    });
  }

  updateChangelog() {
    const getChangelog = () =>
      execa.command(
        `lerna exec --scope ${this.name} --concurrency 1 --no-sort -- conventional-changelog \
      --preset angular --lerna-package ${this.name} --commit-path ${this.location}`,
        { shell: true },
      );
    const updateChangelog = () =>
      execa.command(
        `lerna exec --scope ${this.name} --concurrency 1 --no-sort -- conventional-changelog \
      --preset angular --infile CHANGELOG.md --same-file --lerna-package ${this.name} --commit-path ${this.location}`,
        { shell: true },
      );
    return Repository.fetchTags()
      .then((...args) => this.createSmokeTag(args))
      .then(() =>
        getChangelog().then(({ stdout }) => {
          this.changelog = stdout.replace(/#/, `## ${this.name}`);
        }),
      )
      .then(updateChangelog)
      .then(() => this.deleteSmokeTag())
      .then(() => this);
  }

  bump(
    type = null,
    prerelease = false,
    preid = null,
    checkPreReleaseFile = true,
  ) {
    return Repository.fetchTags()
      .then((...args) => this.createSmokeTag(args))
      .then(
        () =>
          new Promise((resolve, reject) => {
            bump(
              {
                preset: 'angular',
                lernaPackage: this.name,
                path: this.location,
              },
              (err, recommendation) =>
                err ? reject(err) : resolve(recommendation),
            );
          }),
      )
      .then((recommendation) => {
        const releaseType = type || recommendation.releaseType;
        const regExpSemverPreRelease = /(\d+)\.(\d+)\.(\d+)-(\w+)\.(\d+)/g;
        let newVersion;
        let preId = preid;
        let preRelease = prerelease;

        const preReleaseFilePath = path.join(this.location, '.prerelease');
        if (checkPreReleaseFile && fs.existsSync(preReleaseFilePath)) {
          preId = fs
            .readFileSync(preReleaseFilePath)
            .toString()
            .trim();
          preRelease = true;
        }

        // Check if the last release was a pre-release
        // If it's already a pre-release, we should sometimes bump only the pre-release digit
        // Because we don't want:
        // - packageA@2.0.1-alpha.0
        // - Patch on packageA
        // - packageA@2.0.2-alpha.0
        // Expected result:
        // - packageA@2.0.1-alpha.0
        // - Patch on packageA
        // - packageA@2.0.1-alpha.1
        if (preRelease && regExpSemverPreRelease.test(this.version)) {
          const matchs = this.version.match(regExpSemverPreRelease);
          // 0: Fullmatch
          // 1: Major digit
          // 2: Minor digit
          const minorDigit = parseInt(matchs[2], 10);
          // 3: Patch Digit
          // 4: Prerelease name
          // 5: Digit of prerelease

          if (releaseType === 'patch') {
            // Match example: 2.1.1-alpha.0 -> 2.1.1-alpha.1
            // Match example: 2.1.0-alpha.0 -> 2.1.0-alpha.1
            newVersion = semver.inc(this.version, 'prerelease', preId);
          } else if (releaseType === 'minor') {
            // Min Minor
            if (minorDigit > 0) {
              // Match example: 2.1.0-alpha.0 -> 2.1.0-alpha.1
              newVersion = semver.inc(this.version, 'prerelease', preId);
            } else {
              // Match example: 2.1.1-alpha.0 -> 2.2.0-alpha.0
              // Match example: 2.0.1-alpha.0 -> 2.1.0-alpha.0
              newVersion = semver.inc(this.version, 'preminor', preId);
            }
          } else {
            // Min major
            // Match example: 3.0.0-alpha.0 -> 3.0.0-alpha.1
            // Match example: 2.1.1-alpha.0 -> 3.0.0-alpha.0
            // Match example: 2.1.0-alpha.0 -> 3.0.0-alpha.0
            newVersion = semver.inc(this.version, 'prerelease', preId);
          }
        } else {
          newVersion = semver.inc(
            this.version,
            preRelease ? `pre${releaseType}` : releaseType,
            preId,
          );
        }

        return this.updatePackageJson({ version: newVersion })
          .then(() => this.deleteSmokeTag())
          .then(() => ({
            repository: this,
            releaseType,
            newVersion,
          }));
      });
  }

  hasChanges() {
    return new Promise((resolve) => {
      this.constructor.fetchTags().then((tag) => {
        gitRawCommits({
          format: '%B%n-hash-%n%H',
          from: tag || '',
          path: this.location,
        })
          .pipe(conventionalCommitsParser())
          .pipe(
            concat((commits) => {
              resolve(
                commits.filter(
                  ({ type, notes }) =>
                    ['feat', 'fix', 'perf'].includes(type) || notes.length > 0,
                ).length > 0,
              );
            }),
          );
      });
    });
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

  toString() {
    return `${String(this.repository)} ⇒ ${String(this.dependency)} ${
      this.semanticVersion
    }${this.isPeerDependency ? ' (peer)' : ''}`;
  }

  isValid() {
    return semver.satisfies(this.dependency.version, this.semanticVersion);
  }

  needsUpdate() {
    return this.semanticVersion !== `^${this.dependency.version}`;
  }

  update() {
    const packageJson = this.repository.getPackageJson();
    const { name } = this.dependency;
    if (this.isPeerDependency) {
      if (packageJson.peerDependencies) {
        packageJson.peerDependencies[name] = `^${this.dependency.version}`;
      }
    } else if (packageJson.dependencies) {
      packageJson.dependencies[name] = `^${this.dependency.version}`;
    }
    return this.repository.updatePackageJson(packageJson).then(
      () =>
        new Dependency(this.repository, this.dependency, {
          semanticVersion: `^${this.dependency.version}`,
          isPeerDependency: this.isPeerDependency,
        }),
    );
  }
}

module.exports = {
  MonoRepository,
  Repository,
  Dependency,
};
/* eslint-enable global-require, import/no-dynamic-require,
max-classes-per-file, no-use-before-define */
