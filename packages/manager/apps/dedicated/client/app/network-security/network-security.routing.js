export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network-security', {
    url: '/network-security',
    component: 'networkSecurity',
    reloadOnSearch: false,
    redirectTo: 'network-security.scrubbing-center',
    resolve: {
      apiPath: () => '/networkDefense/vac',
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('network_security_title'),
      goToScrubbingCenter: /* @ngInject */ ($state) => () =>
        $state.go('network-security.scrubbing-center'),
      isScrubbingCenterActive: /* @ngInject */ ($state) => () =>
        $state.includes('network-security.scrubbing-center'),
      isTrafficChartActive: /* @ngInject */ ($state) => () =>
        $state.includes('network-security.traffic-chart'),
    },
  });
};
