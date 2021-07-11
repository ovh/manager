#!/usr/bin/env node
const execa = require('execa');
const gitUrlParse = require('git-url-parse');
const ora = require('ora');
const path = require('path');
const program = require('commander');
const find = require('lodash/find');
const kebabCase = require('lodash/kebabCase');

const getBranchUrl = async (branch) => {
  const { stdout: remoteUrl } = await execa('git', [
    'config',
    '--get',
    'remote.origin.url',
  ]);
  const gitHttpsUrl = gitUrlParse(remoteUrl).toString('https');
  return `git+${gitHttpsUrl}#${branch}`;
};

const getCurrentBranch = () =>
  execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']).then(
    ({ stdout: branchName }) => branchName,
  );

const getPackageInfos = (name) =>
  execa('lerna', ['list', '-la', '--json']).then(({ stdout: packageList }) => {
    const searchPackage = find(JSON.parse(packageList), { name });
    if (!searchPackage) {
      return Promise.reject(new Error(`"${name}" package not found`));
    }
    if (searchPackage.private) {
      return Promise.reject(
        new Error(`"${searchPackage.name}" is a private package`),
      );
    }
    return searchPackage;
  });

const getSubtreeBranch = (packageName, currentBranch) => {
  const [scope, name] = packageName.split('/');
  const leftPart = name || scope;
  return `split-${leftPart}/${kebabCase(currentBranch)}`;
};

const subtreeSplit = (prefix, branch) =>
  execa('git', [
    'subtree',
    'split',
    `--prefix=${prefix}`,
    `--branch=${branch}`,
  ]);

const pushBranch = (branch) => execa('git', ['push', 'origin', branch]);

const subtreePush = (prefix, remote, branch) =>
  execa('git', ['subtree', 'push', `--prefix=${prefix}`, remote, branch]);

const split = async (packageName, { branch, remote, push }) => {
  let spinner = ora('Search Package infos').start();

  try {
    const packageInfos = await getPackageInfos(packageName);
    const currentBranch = await getCurrentBranch();
    spinner.succeed();

    const branchName =
      branch ||
      (remote
        ? currentBranch
        : getSubtreeBranch(packageInfos.name, currentBranch));
    const prefix = path.relative(process.cwd(), packageInfos.location);

    if (!remote) {
      spinner = ora(
        `Create subtree branch "${branchName}" from "${packageName}" package (${prefix})`,
      ).start();
      await subtreeSplit(prefix, branchName);
      spinner.succeed();

      if (push) {
        spinner = ora(`Pushing "${branchName}" to origin`).start();
        await pushBranch(branchName);
        spinner.succeed();
      }

      console.log('🎉  And now, you should:\n');
      if (!push) {
        console.log(`📤  push your branch:
  git push origin ${branchName}
`);
      }
      const url = await getBranchUrl(branchName);
      console.log(`📦  use the splitted branch in your repository:
  yarn add ${url}
`);
    } else {
      spinner = ora(
        `Create remote subtree branch "${branchName}" from "${packageName}" package (${prefix}) on ${remote}`,
      ).start();
      await subtreePush(prefix, remote, branchName);
      spinner.succeed();
    }
  } catch (error) {
    spinner.fail();
    console.error(error.message);
  }
};

program
  .description(
    'Generate a subtree branch (from the current one) for the specified package',
  )
  .usage('[options] <packageName>')
  .option('-b, --branch [branch]', 'set a custom branch name')
  .option(
    '-p, --push',
    'push the splitted branch to origin (useless with "remote" option)',
  )
  .option(
    '-r, --remote [remote]',
    'remote url (like git@github.com:ovh-ux/manager.git)',
  )
  .addHelpText(
    'after',
    `
Examples:

  * Split a module:
    $ split @ovh-ux/manager-core

  * Split a module and push the subtree branch:
    $ split @ovh-ux/manager-core --push

  * Split a module and specify a branch name:
    $ split @ovh-ux/manager-core --branch manager-core/split

  * Split a module and push it to another repository:
    $ split @ovh-ux/manager-core --remote git@github.com:ovh-ux/manager.git
    `,
  )
  .action(() => {
    const [packageName] = program.args;
    const { branch, push, remote } = program.opts();

    if (packageName) {
      split(packageName, {
        branch: branch || false,
        push,
        remote: remote || false,
      });
    } else {
      program.outputHelp();
    }
  })
  .parse(process.argv);
