import template from './MULTISITE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite', {
    url: '/multisite',
    controller: 'HostingTabDomainsCtrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_multisite'),
    },
  });
};
