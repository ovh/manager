import template from './RUNTIMES.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.runtimes', {
    url: '/runtimes',
    controller: 'HostingRuntimesCtrl',
    template,
  });
};
