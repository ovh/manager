module.exports = ({ name, description }) => ({
  name: `@ovh-ux/manager-${name}`,
  version: '0.0.0',
  private: true,
  repository: {
    type: 'git',
    url: 'git+https://github.com/ovh/manager.git',
    directory: `packages/manager/modules/${name}`,
  },
  description,
  license: 'BSD-3-Clause',
  author: 'OVH SAS',
  main: './src/index.js',
  dependencies: {
    bootstrap4: 'twbs/bootstrap#v4.0.0',
  },
  peerDependencies: {
    '@ovh-ux/manager-core': '^10.0.0 || ^11.0.0',
    '@ovh-ux/manager-ng-layout-helpers': '^2.0.0',
    '@ovh-ux/ng-ui-router-breadcrumb': '^1.0.0',
    '@ovh-ux/ui-kit': '^4.4.3',
    '@uirouter/angularjs': '^1.0.23',
    angular: '^1.7.5',
    'angular-translate': '^2.18.1',
    oclazyload: '^1.1.0',
  },
});
