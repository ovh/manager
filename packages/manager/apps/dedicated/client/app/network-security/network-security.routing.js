export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network-security', {
    url: '/network-security',
    component: 'networkSecurity',
    reloadOnSearch: false,
    redirectTo: 'network-security.scrubbing-center',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('network_security_title'),
      goToScrubbingCenter: /* @ngInject */ ($state) => () =>
        $state.go('network-security.scrubbing-center'),
      goToTraffic: /* @ngInject */ ($state) => () =>
        $state.go('network-security.traffic'),
      isScrubbingCenterActive: /* @ngInject */ ($state) => () =>
        $state.includes('network-security.scrubbing-center'),
      isTrafficActive: /* @ngInject */ ($state) => () =>
        $state.includes('network-security.traffic'),
    },
  });
};
