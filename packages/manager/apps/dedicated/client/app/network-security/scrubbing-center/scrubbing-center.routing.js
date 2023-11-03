export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network-security.scrubbing-center', {
    url: '/scrubbing-center',
    component: 'scrubbingCenter',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('network_security_dashboard_title'),
      showStats: /* @ngInject */ ($state) => (row) =>
        $state.go('network-security.traffic', { subnet: row.subnet }),
    },
  });
};
