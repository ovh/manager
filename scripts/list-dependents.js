#!/usr/bin/env node
const program = require('commander');
const execa = require('execa');
const reduce = require('lodash/reduce');
const uniq = require('lodash/uniq');

async function getPackageGraph() {
  try {
    const { stdout } = await execa.command(`lerna list --graph --all`, {
      shell: true,
    });
    return JSON.parse(stdout);
  } catch (error) {
    return [];
  }
}

const findDependents = (packages, packageName) =>
  reduce(
    packages,
    (acc, dependencies, name) => {
      if (dependencies.includes(packageName)) {
        return uniq([...acc, name, ...findDependents(packages, name)]);
      }

      return acc;
    },
    [],
  );

program
  .description('List all packages impacted by the change of given package')
  .usage('<packageName>')
  .arguments('<packageName>')
  .action(async (packageName) => {
    const packageGraph = await getPackageGraph();
    const dependents = findDependents(packageGraph, packageName);
    dependents.map((d) => console.log(d));
  })
  .parse(process.argv);
