import configGenerator from '@ovh-ux/component-rollup-config';

const config = configGenerator({
  input: './src/index.js',
});

export default [
  config.es(),
  config.cjs(),
  config.umd({
    output: {
      globals: {
        '@uirouter/angularjs': 'uiRouter',
        angular: 'angular',
        'angular-translate': 'pascalprecht.translate',
        'ipaddr.js': 'ipaddr',
        jquery: '$',
        lodash: '_',
        moment: 'moment',
        punycode: 'punycode',
        urijs: 'URI',
      },
    },
  }),
];
