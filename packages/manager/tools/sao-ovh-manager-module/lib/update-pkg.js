module.exports = ({ name, description }) => ({
  name: `@ovh-ux/manager-${name}`,
  version: '0.0.0',
  private: true,
  description,
  license: 'BSD-3-Clause',
  author: 'OVH SAS',
  main: './src/index.js',
  peerDependencies: {
    '@ovh-ux/manager-core': '^7.5.0',
    '@uirouter/angularjs': '^1.0.23',
    angular: '^1.7.5',
    'angular-translate': '^2.18.1',
  },
});
