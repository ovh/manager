export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host', {
    url: '/host',
    component: 'anthosHost',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_host'),
    },
  });
};
