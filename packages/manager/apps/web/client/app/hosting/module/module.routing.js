import template from './MODULE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.module', {
    url: '/module',
    controller: 'HostingTabModulesController',
    template,
  });
};
