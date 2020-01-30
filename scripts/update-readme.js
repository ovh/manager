#!/usr/bin/env node
const path = require('path');
const execa = require('execa');
const markdownMagic = require('markdown-magic');

const getPackages = async () => {
  const { stdout: packageList } = await execa('lerna', [
    'list',
    '-a',
    '--json',
  ]);
  return JSON.parse(packageList).map((pkg) => ({
    ...pkg,
    location: path.relative(process.cwd(), pkg.location),
  }));
};

const filterPackages = (
  pkgs,
  { publicPackage = true, privatePackage = false, packagePath },
) => {
  let filteredPackages = [...pkgs];
  if (!publicPackage) {
    filteredPackages = filteredPackages.filter((pkg) => pkg.private);
  }
  if (!privatePackage) {
    filteredPackages = filteredPackages.filter((pkg) => !pkg.private);
  }
  if (packagePath) {
    filteredPackages = filteredPackages.filter((pkg) =>
      pkg.location.startsWith(packagePath),
    );
  }

  return filteredPackages;
};

const buildTableHeader = (showBadges = []) => {
  const tableHeadersDefinition = {
    package: {
      title: 'Package',
      align: 'left',
    },
    version: {
      title: 'Version',
      align: 'left',
    },
    deps: {
      title: 'Dependencies',
      align: 'left',
    },
    devDeps: {
      title: 'Dev dependencies',
      align: 'left',
    },
    peerDeps: {
      title: 'Peer dependencies',
      align: 'left',
    },
    changelog: {
      title: 'Changelog',
      align: 'center',
    },
  };

  const headerIds = ['package', ...showBadges, 'changelog'];

  const colTitles = headerIds.map(
    (header) => tableHeadersDefinition[header].title,
  );

  const colSeparators = headerIds.map((header) => {
    let separator = '';
    switch (tableHeadersDefinition[header].align) {
      case 'center':
        separator = `:${'-'.repeat(
          tableHeadersDefinition[header].title.length - 2,
        )}:`;
        break;
      default:
        separator = '-'.repeat(tableHeadersDefinition[header].title.length);
        break;
    }
    return separator;
  });

  return `| ${colTitles.join(' | ')} |
| ${colSeparators.join(' | ')} |`;
};

const buildTableLine = ({ name, location }, showBadges) => {
  const cols = [
    `[${name}](https://github.com/ovh/manager/tree/master/${location})`,
    ...showBadges.map((badge) => {
      switch (badge) {
        case 'version':
          return `[![npm version](https://badgen.net/npm/v/${name})](https://www.npmjs.com/package/${name})`;
        case 'deps':
          return `[![Dependencies](https://badgen.net/david/dep/ovh/manager/${location})](https://npmjs.com/package/${name}?activeTab=dependencies)`;
        case 'devDeps':
          return `[![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/${location})](https://npmjs.com/package/${name}?activeTab=dependencies)`;
        case 'peerDeps':
          return `[![Peer Dependencies](https://badgen.net/david/peer/ovh/manager/${location})](https://npmjs.com/package/${name}?activeTab=dependencies)`;
        default:
          return '';
      }
    }),
    `[:books:](https://github.com/ovh/manager/blob/master/${location}/CHANGELOG.md)`,
  ];

  return `| ${cols.join(' | ')} |`;
};

const updateReadme = async () => {
  const packages = await getPackages();
  const markdownPath = path.join(process.cwd(), 'README.md');
  markdownMagic(markdownPath, {
    transforms: {
      /*
          Match :
            <!-- AUTO-GENERATED-CONTENT:START (PACKAGES:showBadges=false&name=module) -->
              <!-- CONTENT WILL BE GENERATED HERE -->
            <!-- AUTO-GENERATED-CONTENT:END *-->
          Default Options: {
            level: 1,
            packagePath: '',
            publicPackage: true,
            privatePackage: false,
            showBadges: 'version|deps|devDeps|peerDeps',
            name: 'package',
          }
        */
      PACKAGES: (content, _options = {}) => {
        let { showBadges } = _options;
        if (showBadges === 'false') {
          showBadges = [];
        } else {
          showBadges = (showBadges || 'version|deps|devDeps|peerDeps').split(
            '|',
          );
        }
        const options = {
          level: _options.level || 2,
          packagePath: _options.packagePath || false,
          publicPackage: (_options.publicPackage || 'true') === 'true',
          privatePackage: (_options.privatePackage || 'false') === 'true',
          showBadges,
          name: _options.name || 'packages',
        };

        const packageList = filterPackages(packages, options);

        if (packageList.length === 0) {
          return '';
        }

        const header = `${'#'.repeat(options.level)} Availables ${
          options.name
        }`;
        const tableaHeader = buildTableHeader(options.showBadges);

        const lines = packageList.map((pkg) =>
          buildTableLine(pkg, options.showBadges),
        );

        return `${header}

${tableaHeader}
${lines.join('\n')}`;
      },
    },
  });
};

try {
  updateReadme();
} catch (error) {
  console.log(error);
  process.exit(1);
}
