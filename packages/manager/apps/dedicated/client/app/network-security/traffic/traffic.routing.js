export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network-security.traffic', {
    url: '/traffic',
    component: 'traffic',
    params: {
      subnet: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('network_security_dashboard_title'),
      getSubnet: /* @ngInject */ ($state) => () => $state.params.subnet,
    },
  });
};
