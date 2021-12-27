export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.access-restriction', {
    url: '/access-restriction',
    views: {
      anthosTenantView: 'anthosAccessRestriction',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_access_restriction_title'),
    },
  });
};
