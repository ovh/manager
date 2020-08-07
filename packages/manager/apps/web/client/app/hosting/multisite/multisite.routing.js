import template from './MULTISITE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite', {
    url: '/multisite',
    controller: 'HostingTabDomainsCtrl',
    template,
  });
};
