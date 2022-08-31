#!/usr/bin/env node
const execa = require('execa');
const program = require('commander');
const path = require('path');
const remove = require('lodash/remove');
const uniq = require('lodash/uniq');
const EventEmitter = require('events');
const ProgressBar = require('progress');
const project = require('@lerna/project');
const PackageGraph = require('@lerna/package-graph');
const { Worker, SHARE_ENV } = require('worker_threads');

// Increase the default limit to avoid memory leaks
EventEmitter.defaultMaxListeners = 100;

const myEmitter = new EventEmitter();

let bar;
let projectPackages;
let packageGraph;
let modules;
let i = 0;

/**
 * Get all dependencies.
 * @param  {string[]} basePackages
 * @param  {String} [type='dependencies']
 * @return {string[]}
 */
function getDeps(basePackages, type = 'dependencies') {
  const depKey =
    type === 'dependencies' ? 'localDependencies' : 'localDependents';

  return basePackages.reduce((dependendentsPackages, packageName) => {
    const localDeps = [...packageGraph.get(packageName)[depKey].keys()];

    return uniq([
      packageName,
      ...dependendentsPackages,
      ...localDeps,
      ...getDeps(localDeps, type),
    ]);
  }, []);
}

/**
 * Find dependents packages.
 * @param  {string[]} packages List of packages' name.
 * @return {string[]}          List of packages' name including dependents.
 */
function getDependents(packages) {
  return getDeps(packages, 'dependents');
}

/**
 * Find dependencies on a given packages' list.
 * @param  {string[]} packages List of packages' name.
 * @return {string[]}          List of packages' name including dependencies.
 */
function getDependencies(packages) {
  return getDeps(packages, 'dependencies');
}

/**
 * Find all packages that requires a build.
 * @param  {string[]} packages List of packages' name.
 * @return {string[]}          List of packages' name including dependencies.
 */
function getAllDeps(packages) {
  const dependents = getDependents(packages);

  return getDependencies(dependents);
}

/**
 * Find all packages that requires to be built based on a package list.
 * @param  {string[]} packages List of packages requested to be built.
 * @return {string[]}          List of packages that requires to be built.
 */
async function getPackagesByPackagesName(packages) {
  try {
    return getDependencies(packages);
  } catch (error) {
    return [];
  }
}

/**
 * List all packages' name from all workspaces.
 * See: {@link https://github.com/lerna/lerna/tree/main/core/package-graph|@lerna/package-graph}
 * @return {string[]} Complete packages' name list.
 */
async function getAllPackages() {
  try {
    return projectPackages.map(({ name }) => name);
  } catch (error) {
    return [];
  }
}

/**
 * List packages that has recently changed by using `lerna changed`.
 * See {@link https://github.com/lerna/lerna/tree/main/commands/changed|@lerna/changed}
 * @return {Promise<string[]>} List of packages that requires to be built.
 */
async function getChangedPackages() {
  try {
    const { stdout } = await execa.command(
      `lerna changed --all --include-merged-tags --json --toposort`,
      {
        shell: true,
      },
    );
    return getAllDeps(JSON.parse(stdout).map(({ name }) => name));
  } catch (error) {
    return [];
  }
}

/**
 * Find dependencies.
 * @param  {string[]} packages List of packages' name.
 * See: {@link https://github.com/lerna/lerna/tree/main/core/package-graph|@lerna/package-graph}
 * @return {Promise}
 */
async function retrieveDependencies(packages) {
  return Promise.resolve(
    packages.map((pkg) => {
      const packageInfo = packageGraph.get(pkg);

      return {
        name: packageInfo.name,
        location: packageInfo.location,
        version: packageInfo.version,
        dependents: [...packageInfo.localDependencies.keys()],
      };
    }),
  );
}

function unstack() {
  if (program.verbose) {
    console.log(`-=-=-=- #${i} -=-=-=-`);
    console.log(
      `TODO (${modules.todo.length})`,
      modules.todo.map(({ name }) => name).join(', '),
    );
    console.log(
      `DOING (${modules.doing.length})`,
      modules.doing.map(({ name }) => name).join(', '),
    );
    console.log(
      `DONE (${modules.done.length})`,
      modules.done.map(({ name }) => name).join(', '),
    );
    i += 1;
  }

  if (modules.todo.length === 0 && modules.doing.length === 0) {
    myEmitter.emit('complete');
    return;
  }

  modules.todo.map((pck) => {
    const deps = pck.dependents.filter(
      (dep) => !modules.done.find(({ name }) => name === dep),
    );

    if (
      deps.length === 0 &&
      (!program.numWorkers || modules.doing.length < program.numWorkers)
    ) {
      const workerData = remove(modules.todo, (p) => p.name === pck.name)[0];
      modules.doing.push(workerData);

      const promise = program.dryRun
        ? Promise.resolve()
        : new Promise((resolve, reject) => {
            const worker = new Worker(
              path.join(__dirname, '/worker/build_module.js'),
              {
                workerData,
                env: SHARE_ENV,
              },
            );

            worker.on('online', () => {
              if (program.verbose) {
                console.log(`Start build of ${workerData.name}`);
              }
            });
            worker.on('message', (messageFromWorker) => {
              if (program.verbose) {
                console.log(messageFromWorker);
              }
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
              if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
              resolve();
            });
          });

      return promise
        .then(() => {
          if (!program.verbose) {
            bar.tick();
          }
          remove(modules.doing, workerData);
          modules.done.push(workerData);
          myEmitter.emit('unstack');
        })
        .catch(() => {
          process.exit(1);
        });
    }
    return null;
  });
}

program
  .option('--dry-run', 'Launch the build script without creating dist')
  .option(
    '--num-workers [maxWorkers]',
    'Limit the number of worker threads',
    parseInt,
  )
  .option('--optimize', 'Build only packages with changes')
  .option(
    '-p, --package [package]',
    'Scope build to a specific package and its dependencies',
  )
  .option('--verbose', 'output extra debugging')
  .action(async () => {
    process.env.VERBOSE = program.verbose;

    projectPackages = await project.getPackages();
    packageGraph = new PackageGraph(projectPackages);

    let packagesInfos = [];

    if (program.package) {
      // TODO: use variadic option instead of passing an array.
      packagesInfos = await getPackagesByPackagesName([program.package]);
    } else if (program.optimize) {
      packagesInfos = await getChangedPackages();
    } else {
      packagesInfos = await getAllPackages();
    }

    return retrieveDependencies(packagesInfos).then((todo) => {
      modules = {
        todo,
        doing: [],
        done: [],
      };

      console.log(`${todo.length} package(s) require a build process.`);

      if (!program.verbose) {
        bar = new ProgressBar('  building [:bar] :percent (:current/:total)', {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: todo.length,
        });
      }

      myEmitter.on('unstack', () => unstack());
      myEmitter.emit('unstack');
      myEmitter.on('complete', () => {
        console.log('Build operation has been done successfully!');
      });
    });
  })
  .parse(process.argv);
