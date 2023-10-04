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
      reload: /* @ngInject */ ($state) => (state, params = {}) =>
        $state.go(state, params, {
          reload: $state.includes(state) ? state : false,
          inherit: false,
        }),
      goToScrubbingCenter: /* @ngInject */ (reload) => () =>
        reload('network-security.scrubbing-center'),
      isScrubbingCenterActive: /* @ngInject */ ($state) => () =>
        $state.includes('network-security.scrubbing-center'),
      isTrafficChartActive: /* @ngInject */ ($state) => () =>
        $state.includes('network-security.traffic-chart'),
    },
  });
};
