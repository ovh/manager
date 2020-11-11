angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.configuration', {
    url: '/configuration',
    component: 'configuration',
    translations: { value: ['../common'], format: 'json' },
    resolve: {
      isHPC: /* @ngInject */ ($transition$) => {
        try {
          return $transition$.redirectedFrom().to().name === 'app.hpc';
        } catch (err) {
          return false;
        }
      },
    },
  });
});
